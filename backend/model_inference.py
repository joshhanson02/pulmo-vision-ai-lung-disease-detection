import torch
import numpy as np
from PIL import Image
import io
import os
import gc
from timm import create_model
from scipy.ndimage import sobel

# ──────────────────────────────────────────────
# CONFIG
# ──────────────────────────────────────────────
IMG_SIZE = 224
CLASS_NAMES = ["BACTERIAL", "NORMAL", "VIRAL"]
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = "swin_best_model.pth"

# ImageNet normalization (same as training)
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)

# Temperature for probability calibration (tune if needed: >1 = softer, <1 = sharper)
TEMPERATURE = 1.5

_model = None


# ──────────────────────────────────────────────
# X-RAY DETECTION  (multi-feature scoring)
# ──────────────────────────────────────────────

def _grayscale(img_np: np.ndarray) -> np.ndarray:
    """Convert float32 HxWx3 → HxW grayscale."""
    return 0.2989 * img_np[..., 0] + 0.5870 * img_np[..., 1] + 0.1140 * img_np[..., 2]


def _score_aspect_ratio(w: int, h: int) -> float:
    """
    Chest X-rays are roughly square to slightly portrait/landscape.
    Hard-reject extreme ratios; softer penalty for borderline.
    """
    aspect = w / h
    if aspect < 0.5 or aspect > 2.0:
        return 0.0          # almost certainly not a chest X-ray
    if 0.7 <= aspect <= 1.4:
        return 1.0          # ideal range
    return 0.5              # borderline


def _score_grayscale_similarity(img_np: np.ndarray) -> float:
    """
    X-rays converted to RGB have near-identical R/G/B channels.
    A high channel-difference means the image is colourful → not an X-ray.
    """
    r, g, b = img_np[..., 0], img_np[..., 1], img_np[..., 2]
    max_diff = max(
        float(np.mean(np.abs(r - g))),
        float(np.mean(np.abs(g - b))),
        float(np.mean(np.abs(r - b))),
    )
    # X-rays typically have max_diff < 0.05; natural photos are often > 0.10
    if max_diff < 0.04:
        return 1.0
    if max_diff < 0.08:
        return 0.7
    if max_diff < 0.15:
        return 0.3
    return 0.0


def _score_entropy(gray: np.ndarray) -> float:
    """
    Shannon entropy of pixel-intensity histogram.
    X-rays span a broad dynamic range → moderate-to-high entropy (4–7 bits).
    Blank / near-uniform images score low; overly complex natural scenes may score high.
    """
    hist, _ = np.histogram(gray, bins=256, range=(0.0, 1.0))
    hist = hist / (hist.sum() + 1e-9)
    nonzero = hist[hist > 0]
    entropy = float(-np.sum(nonzero * np.log2(nonzero)))
    # Ideal: 4 – 7 bits
    if 3.5 <= entropy <= 7.5:
        return 1.0
    if 2.5 <= entropy <= 8.0:
        return 0.5
    return 0.0


def _score_edge_density(gray: np.ndarray) -> float:
    """
    X-rays have a moderate amount of edges (ribs, lung margins, heart border).
    Very low → featureless; very high → noise / natural photo.
    """
    sx = sobel(gray, axis=1)
    sy = sobel(gray, axis=0)
    magnitude = np.hypot(sx, sy)
    edge_density = float(np.mean(magnitude))
    # Typical X-ray range: 0.02 – 0.18
    if 0.015 <= edge_density <= 0.20:
        return 1.0
    if 0.008 <= edge_density <= 0.30:
        return 0.5
    return 0.0


def _score_brightness_distribution(gray: np.ndarray) -> float:
    """
    Chest X-rays have a characteristic bimodal / wide distribution:
    dark lung fields + bright mediastinum.  The std-dev of pixel intensities
    is a simple proxy.  Std < 0.05 → near-uniform; std > 0.45 → over-exposed / cartoon.
    """
    std = float(np.std(gray))
    if 0.08 <= std <= 0.40:
        return 1.0
    if 0.05 <= std <= 0.45:
        return 0.5
    return 0.0


def _score_dark_border(gray: np.ndarray) -> float:
    """
    Many chest X-rays have dark (near-black) corners / borders
    because the X-ray beam doesn't reach the film edges.
    """
    h, w = gray.shape
    bw = max(1, int(min(h, w) * 0.05))   # 5% border width
    border_pixels = np.concatenate([
        gray[:bw, :].ravel(),
        gray[-bw:, :].ravel(),
        gray[:, :bw].ravel(),
        gray[:, -bw:].ravel(),
    ])
    border_mean = float(np.mean(border_pixels))
    center_mean = float(np.mean(gray[bw:-bw, bw:-bw]))
    # Border significantly darker than centre is a good sign
    if border_mean < 0.25 and center_mean > border_mean + 0.05:
        return 1.0
    if border_mean < 0.40:
        return 0.5
    return 0.0


# Weights for each feature (must sum to 1.0)
_FEATURE_WEIGHTS = {
    "aspect_ratio":           0.10,
    "grayscale_similarity":   0.30,   # strongest signal
    "entropy":                0.20,
    "edge_density":           0.15,
    "brightness_distribution": 0.15,
    "dark_border":            0.10,
}

XRAY_THRESHOLD = 0.52   # composite score must exceed this to be accepted


def is_likely_xray(img_np: np.ndarray) -> tuple[bool, float, dict]:
    """
    Returns (is_xray, composite_score, per_feature_scores).
    img_np: float32, shape HxWx3, values in [0, 1].
    """
    h, w = img_np.shape[:2]
    gray = _grayscale(img_np)

    scores = {
        "aspect_ratio":           _score_aspect_ratio(w, h),
        "grayscale_similarity":   _score_grayscale_similarity(img_np),
        "entropy":                _score_entropy(gray),
        "edge_density":           _score_edge_density(gray),
        "brightness_distribution": _score_brightness_distribution(gray),
        "dark_border":            _score_dark_border(gray),
    }

    composite = sum(scores[k] * _FEATURE_WEIGHTS[k] for k in scores)

    # Hard-fail: if grayscale_similarity is 0, image is clearly colourful
    if scores["grayscale_similarity"] == 0.0:
        return False, composite, scores

    return composite >= XRAY_THRESHOLD, composite, scores


# ──────────────────────────────────────────────
# MODEL
# ──────────────────────────────────────────────

def load_model() -> torch.nn.Module:
    global _model
    if _model is None:
        print(f"Loading Swin-Base model from '{MODEL_PATH}' on {DEVICE}...")
        _model = create_model(
            "swin_base_patch4_window7_224",
            pretrained=False,
            num_classes=len(CLASS_NAMES),
        )
        if os.path.exists(MODEL_PATH):
            state = torch.load(MODEL_PATH, map_location=DEVICE)
            # Handle common checkpoint wrappers
            if isinstance(state, dict) and "model_state_dict" in state:
                state = state["model_state_dict"]
            elif isinstance(state, dict) and "state_dict" in state:
                state = state["state_dict"]
            _model.load_state_dict(state, strict=True)
            print("Checkpoint loaded successfully.")
        else:
            print(
                f"WARNING: '{MODEL_PATH}' not found — running with random weights.")
        _model.to(DEVICE).eval()
    return _model


# ──────────────────────────────────────────────
# PREPROCESSING
# ──────────────────────────────────────────────

def preprocess(img_pil: Image.Image) -> torch.Tensor:
    """Resize → normalize → CHW tensor (batch-dim added)."""
    img = img_pil.resize((IMG_SIZE, IMG_SIZE), Image.BILINEAR)
    arr = np.array(img, dtype=np.float32) / 255.0          # [0,1]
    arr = (arr - MEAN) / STD                                # ImageNet norm
    arr = np.transpose(arr, (2, 0, 1))                      # HWC → CHW
    return torch.tensor(arr, dtype=torch.float32).unsqueeze(0)  # 1xCxHxW


# ──────────────────────────────────────────────
# MAIN API
# ──────────────────────────────────────────────

def analyze_xray(image_bytes: bytes) -> dict:
    """
    Analyze a chest X-ray image.

    Returns a dict with:
      - label        : "BACTERIAL" | "NORMAL" | "VIRAL" | "UNKNOWN"
      - probability  : float, confidence for predicted class (%)
      - all_probs    : dict mapping each class name → probability (%)
      - xray_score   : composite X-ray detection score (0–1)
      - feature_scores: per-feature breakdown
      - error        : str (only present when label == "UNKNOWN")
    """
    # ── 1. Decode image ──────────────────────────────────────────────────────
    try:
        img_pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        return {"label": "UNKNOWN", "probability": 0.0, "error": f"Cannot decode image: {e}"}

    img_np = np.array(img_pil.resize((IMG_SIZE, IMG_SIZE)),
                      dtype=np.float32) / 255.0

    # ── 2. X-ray detection ───────────────────────────────────────────────────
    xray_ok, xray_score, feat_scores = is_likely_xray(img_np)
    if not xray_ok:
        return {
            "label":         "UNKNOWN",
            "probability":   0.0,
            "xray_score":    round(float(xray_score), 3),
            "feature_scores": {k: round(v, 3) for k, v in feat_scores.items()},
            "error":         (
                "The uploaded image does not appear to be a chest X-ray. "
                f"(detection score: {xray_score:.2f} / threshold: {XRAY_THRESHOLD})"
            ),
        }

    # ── 3. Classification ────────────────────────────────────────────────────
    model = load_model()
    img_tensor = preprocess(img_pil).to(DEVICE)

    with torch.inference_mode():
        logits = model(img_tensor)                              # raw logits
        scaled = logits / TEMPERATURE                           # temperature scaling
        probs = torch.softmax(scaled, dim=1).cpu().numpy()[0]  # shape: (3,)

    pred_idx = int(np.argmax(probs))
    pred_label = CLASS_NAMES[pred_idx]
    pred_prob = float(probs[pred_idx]) * 100

    all_probs = {name: round(float(p) * 100, 1)
                 for name, p in zip(CLASS_NAMES, probs)}

    # ── 4. Cleanup ───────────────────────────────────────────────────────────
    del img_tensor, logits, scaled
    gc.collect()
    if DEVICE.type == "cuda":
        torch.cuda.empty_cache()

    return {
        "label":          pred_label,
        "probability":    round(pred_prob, 1),
        "all_probs":      all_probs,          # full breakdown for all 3 classes
        "xray_score":     round(float(xray_score), 3),
        "feature_scores": {k: round(v, 3) for k, v in feat_scores.items()},
    }


# ──────────────────────────────────────────────
# QUICK TEST  (run: python xray_analyzer.py <image_path>)
# ──────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    import json

    path = sys.argv[1] if len(sys.argv) > 1 else None
    if path is None:
        print("Usage: python xray_analyzer.py <image_path>")
        sys.exit(1)

    with open(path, "rb") as f:
        result = analyze_xray(f.read())

    print(json.dumps(result, indent=2))
