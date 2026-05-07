import torch
import numpy as np
from PIL import Image
import io
import os
from timm import create_model
import cv2
import gc

IMG_SIZE = 224
CLASS_NAMES = ["BACTERIAL", "NORMAL", "VIRAL"]
DEVICE = torch.device("cpu")
MODEL_PATH = "swin_best_model.pth"

_model = None


# =========================================================
# CHECK X-RAY IMAGE
# =========================================================

def is_likely_xray(img_np):

    # Convert grayscale
    gray = cv2.cvtColor(
        (img_np * 255).astype(np.uint8),
        cv2.COLOR_RGB2GRAY
    )

    h, w = gray.shape

    # Aspect ratio
    aspect = w / h
    if aspect < 0.7 or aspect > 1.4:
        return False

    # Contrast check
    contrast = gray.std()

    if contrast < 25:
        return False

    # Edge density
    edges = cv2.Canny(gray, 50, 150)
    edge_density = np.sum(edges > 0) / (h * w)

    if edge_density < 0.01:
        return False

    # Brightness distribution
    mean_brightness = gray.mean()

    if mean_brightness < 30 or mean_brightness > 220:
        return False

    return True


# =========================================================
# LOAD MODEL
# =========================================================

def load_model():

    global _model

    if _model is None:

        print("Loading Swin Tiny Model...")

        _model = create_model(
            "swin_tiny_patch4_window7_224",
            pretrained=False,
            num_classes=3
        )

        if os.path.exists(MODEL_PATH):

            state_dict = torch.load(
                MODEL_PATH,
                map_location=DEVICE
            )

            _model.load_state_dict(state_dict)

        _model.to(DEVICE)
        _model.eval()

    return _model


# =========================================================
# PREPROCESS
# =========================================================

def preprocess(img_pil):

    img = img_pil.resize((IMG_SIZE, IMG_SIZE))

    img = np.array(img).astype(np.float32) / 255.0

    mean = np.array([0.485, 0.456, 0.406])
    std = np.array([0.229, 0.224, 0.225])

    img = (img - mean) / std

    img = np.transpose(img, (2, 0, 1))

    tensor = torch.tensor(
        img,
        dtype=torch.float32
    ).unsqueeze(0)

    return tensor


# =========================================================
# ANALYZE
# =========================================================

def analyze_xray(image_bytes: bytes):

    try:

        model = load_model()

        img_pil = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        img_np = np.array(
            img_pil.resize((IMG_SIZE, IMG_SIZE))
        ).astype(np.float32) / 255.0

        # CHECK X-RAY
        if not is_likely_xray(img_np):

            return {
                "success": False,
                "label": "INVALID",
                "probability": 0,
                "heatmap": "",
                "message": "Ảnh không phải X-quang phổi. Vui lòng upload ảnh X-ray hợp lệ."
            }

        img_tensor = preprocess(img_pil).to(DEVICE)

        with torch.inference_mode():

            output = model(img_tensor)

            prob = torch.softmax(
                output,
                dim=1
            )[0]

            pred_idx = int(torch.argmax(prob))

            pred_prob = float(
                prob[pred_idx].cpu().item()
            ) * 100

        del img_tensor
        del output

        gc.collect()

        return {
            "success": True,
            "label": CLASS_NAMES[pred_idx],
            "probability": round(pred_prob, 2),
            "heatmap": ""
        }

    except Exception as e:

        return {
            "success": False,
            "label": "ERROR",
            "probability": 0,
            "heatmap": "",
            "message": str(e)
        }