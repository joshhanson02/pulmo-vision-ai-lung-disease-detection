<div align="center">

<img src="https://img.shields.io/badge/PulmoVision-AI-blue?style=for-the-badge&logo=lungs&logoColor=white" alt="PulmoVision AI"/>

# 🫁 Pulmo Vision AI
### Lung Disease Detection from Chest X-Ray Images
### Phát hiện Bệnh Phổi từ Ảnh X-Quang Ngực bằng AI

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-pulmo--vision.vercel.app-brightgreen?style=for-the-badge)](https://pulmo-vision.vercel.app)
[![Angular](https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.1-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org)
[![Deployed on Railway](https://img.shields.io/badge/Backend-Railway-7B2BF9?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## 📖 Overview | Tổng Quan

**EN:** Pulmo Vision AI is a full-stack intelligent medical application that analyzes chest X-ray images to detect lung diseases using deep learning. Built with a **Swin Transformer (Swin-Base)** model, the system classifies X-rays into three categories: **Bacterial Pneumonia**, **Viral Pneumonia**, and **Normal**. The application also integrates a conversational AI assistant (Pulmo AI) powered by **Google Gemini**, designed to answer respiratory health questions in a friendly, medically-grounded manner.

**VI:** Pulmo Vision AI là ứng dụng y tế thông minh full-stack, phân tích ảnh X-quang ngực để phát hiện bệnh phổi bằng học sâu. Hệ thống sử dụng mô hình **Swin Transformer (Swin-Base)** để phân loại ảnh X-quang thành ba nhóm: **Viêm phổi do vi khuẩn**, **Viêm phổi do virus**, và **Bình thường**. Ứng dụng còn tích hợp trợ lý AI hội thoại (Pulmo AI) sử dụng **Google Gemini**, được thiết kế để trả lời các câu hỏi về sức khỏe hô hấp một cách thân thiện và có cơ sở y tế.

---

## ✨ Features | Tính Năng

| Feature / Tính năng | Description EN | Mô tả VI |
|---|---|---|
| 🔬 **X-Ray Analysis** | Upload a chest X-ray and get an AI diagnosis in seconds | Tải ảnh X-quang và nhận chẩn đoán AI trong vài giây |
| 🧠 **Swin Transformer** | State-of-the-art Vision Transformer for medical imaging | Mô hình Vision Transformer tiên tiến cho ảnh y tế |
| 🛡️ **X-Ray Validator** | Multi-feature detection to reject non-X-ray images | Phát hiện đa đặc trưng để từ chối ảnh không phải X-quang |
| 💬 **Pulmo AI Chatbot** | Gemini-powered health assistant for lung questions | Trợ lý sức khỏe phổi dùng Google Gemini |
| 🔗 **Smart Bridge** | Scan results are passed directly into the chatbot for follow-up | Kết quả scan được tự động truyền vào chatbot để hỏi thêm |
| 🔍 **Zoom Viewer** | Interactive image zoom (scroll + keyboard support) | Xem ảnh phóng to tương tác (cuộn chuột + bàn phím) |
| 📱 **Responsive UI** | Fully responsive design built with Angular 19 + Bootstrap 5 | Giao diện responsive hoàn toàn, Angular 19 + Bootstrap 5 |
| 📚 **Lung Info Pages** | Educational content on lung diseases and X-ray samples | Nội dung giáo dục về bệnh phổi và mẫu X-quang |

---

## 🏗️ Architecture | Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────────┐
│                     PULMO VISION AI                             │
│                                                                 │
│  ┌──────────────────────┐      ┌──────────────────────────┐    │
│  │   FRONTEND (Angular) │      │   BACKEND (FastAPI)       │    │
│  │   Vercel Hosting     │◄────►│   Railway Hosting         │    │
│  │                      │ HTTP │                            │    │
│  │  • Landing Page      │      │  POST /api/analyze-xray   │    │
│  │  • Scan X-Ray Page   │      │  POST /api/chat           │    │
│  │  • Lung Diseases     │      │                            │    │
│  │  • About Us          │      │  ┌──────────────────────┐ │    │
│  │  • AI Bot Chat       │      │  │  model_inference.py  │ │    │
│  │  • AI Examples       │      │  │  Swin-Base Model     │ │    │
│  └──────────────────────┘      │  │  X-Ray Validator     │ │    │
│                                │  └──────────────────────┘ │    │
│                                │  ┌──────────────────────┐ │    │
│                                │  │  Google Gemini SDK   │ │    │
│                                │  │  (Pulmo AI Chatbot)  │ │    │
│                                │  └──────────────────────┘ │    │
│                                │  ┌──────────────────────┐ │    │
│                                │  │  Hugging Face Hub    │ │    │
│                                │  │  (Model Storage)     │ │    │
│                                │  └──────────────────────┘ │    │
│                                └──────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Model | Mô Hình AI

### Swin Transformer (Swin-Base)

**EN:** The core model is a **Swin Transformer Base** (`swin_base_patch4_window7_224`) trained via transfer learning with ImageNet normalization. It classifies chest X-rays into 3 classes:

**VI:** Mô hình cốt lõi là **Swin Transformer Base** (`swin_base_patch4_window7_224`) được huấn luyện bằng transfer learning với chuẩn hóa ImageNet. Phân loại X-quang ngực thành 3 nhãn:

| Class / Nhãn | Description EN | Mô tả VI |
|---|---|---|
| `BACTERIAL` | Bacterial Pneumonia | Viêm phổi do vi khuẩn |
| `VIRAL` | Viral Pneumonia | Viêm phổi do virus |
| `NORMAL` | Healthy Lungs | Phổi bình thường |

- **Model weights hosted on:** [Hugging Face — joshchan1301/x-ray_img_analysis_ai](https://huggingface.co/joshchan1301/x-ray_img_analysis_ai)
- **Input size:** 224×224 px (ImageNet normalization: mean `[0.485, 0.456, 0.406]`, std `[0.229, 0.224, 0.225]`)
- **Temperature scaling:** `T = 1.5` for probability calibration
- **Runtime:** CPU (via Docker multi-stage build)

### X-Ray Validator | Bộ Kiểm Tra X-Quang

**EN:** Before classification, every uploaded image is validated using a 6-feature composite scoring system to ensure it is a genuine chest X-ray:

**VI:** Trước khi phân loại, mỗi ảnh tải lên sẽ được kiểm tra qua hệ thống chấm điểm tổng hợp 6 đặc trưng để đảm bảo là X-quang ngực thật sự:

| Feature / Đặc trưng | Weight | Description EN | Mô tả VI |
|---|---|---|---|
| Grayscale Similarity | 30% | RGB channels should be near-identical | Các kênh RGB gần như giống nhau |
| Entropy | 20% | Broad dynamic range (4–7 bits) | Dải động rộng (4–7 bit) |
| Edge Density | 15% | Moderate edges (ribs, lung margins) | Mật độ cạnh vừa phải (xương sườn, viền phổi) |
| Brightness Distribution | 15% | High std-dev of pixel intensities | Độ lệch chuẩn pixel cao |
| Aspect Ratio | 10% | Near-square to slightly portrait/landscape | Gần vuông hoặc hơi ngang/dọc |
| Dark Border | 10% | Dark corners characteristic of X-ray film | Viền tối đặc trưng của phim X-quang |

> **Threshold:** Composite score must exceed **0.52** to be accepted.  
> **Ngưỡng:** Điểm tổng hợp phải vượt **0.52** để được chấp nhận.

---

## 🗂️ Project Structure | Cấu Trúc Dự Án

```
pulmo-vision-ai-lung-disease-detection/
│
├── 📁 backend/                        # FastAPI Python Backend
│   ├── main.py                        # API routes, CORS, Gemini chatbot
│   ├── model_inference.py             # Swin model + X-ray validator
│   ├── requirements.txt               # Python dependencies
│   ├── Dockerfile                     # Multi-stage Docker build (CPU)
│   ├── Procfile                       # Railway deployment config
│   └── .dockerignore
│
├── 📁 frontend/                       # Angular 19 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/
│   │   │   │   ├── landing-page/     # Home page
│   │   │   │   ├── scan-xray/        # X-ray upload & scan page
│   │   │   │   ├── lung-diseases/    # Educational disease info page
│   │   │   │   └── about-us/         # About the project page
│   │   │   ├── ai-bot/               # Pulmo AI chatbot widget
│   │   │   ├── ai-examples/          # Sample X-ray examples
│   │   │   ├── developer/            # Developer info component
│   │   │   ├── components/
│   │   │   │   ├── header/           # App header
│   │   │   │   └── footer/           # App footer
│   │   │   ├── shared/
│   │   │   │   └── navbar/           # Navigation bar
│   │   │   ├── services/
│   │   │   │   ├── xray-analysis.service.ts   # HTTP service for /api/analyze-xray
│   │   │   │   └── ai-bot-bridge.service.ts   # Bridge: scan result → chatbot
│   │   │   ├── app.routes.ts         # Lazy-loaded routing
│   │   │   └── app.config.ts         # App config
│   │   ├── styles.scss               # Global styles
│   │   └── index.html
│   ├── angular.json
│   ├── package.json
│   ├── vercel.json                   # Vercel SPA rewrite config
│   └── tsconfig.json
│
├── 📁 docs/
│   └── ANALYSIS OF LUNG DISEASE_Eng.pdf   # Research/analysis document
│
└── README.txt
```

---

## 🛠️ Tech Stack | Công Nghệ Sử Dụng

### Backend
| Technology | Version | Purpose EN | Mục đích VI |
|---|---|---|---|
| **Python** | 3.10 | Runtime | Ngôn ngữ chính |
| **FastAPI** | latest | REST API framework | Framework API REST |
| **PyTorch** | 2.1 (CPU) | Deep learning inference | Suy luận học sâu |
| **timm** | latest | Swin Transformer model | Mô hình Swin Transformer |
| **Google Gemini SDK** | latest | AI chatbot | Chatbot AI |
| **Hugging Face Hub** | latest | Model storage & download | Lưu trữ & tải model |
| **Pillow / NumPy / SciPy** | latest | Image processing | Xử lý ảnh |
| **Docker** | multi-stage | Containerization | Đóng gói ứng dụng |
| **Railway** | — | Cloud deployment | Triển khai đám mây |

### Frontend
| Technology | Version | Purpose EN | Mục đích VI |
|---|---|---|---|
| **Angular** | 19 | SPA framework | Framework SPA |
| **TypeScript** | ~5.7 | Language | Ngôn ngữ |
| **Bootstrap** | 5.3 | UI components | Thành phần UI |
| **SCSS** | — | Styling | Tạo kiểu |
| **Swiper** | 11 | Carousel/slider | Băng chuyền ảnh |
| **Font Awesome** | 6.7 | Icons | Biểu tượng |
| **RxJS** | ~7.8 | Reactive streams | Luồng phản ứng |
| **Vercel** | — | Frontend hosting | Lưu trữ frontend |

---

## 🌐 API Reference | Tài Liệu API

Base URL: `https://pulmo-backend-production-18a1.up.railway.app`

### POST `/api/analyze-xray`

**EN:** Analyze a chest X-ray image file.  
**VI:** Phân tích file ảnh X-quang ngực.

**Request:** `multipart/form-data`
| Field | Type | Description |
|---|---|---|
| `file` | `File` | Chest X-ray image (PNG, JPG, etc.) |

**Response — Success (200):**
```json
{
  "label": "BACTERIAL",
  "probability": 87.3,
  "all_probs": {
    "BACTERIAL": 87.3,
    "NORMAL": 8.1,
    "VIRAL": 4.6
  },
  "xray_score": 0.78,
  "feature_scores": {
    "aspect_ratio": 1.0,
    "grayscale_similarity": 1.0,
    "entropy": 1.0,
    "edge_density": 1.0,
    "brightness_distribution": 0.5,
    "dark_border": 1.0
  }
}
```

**Response — Not an X-Ray (200):**
```json
{
  "label": "UNKNOWN",
  "probability": 0.0,
  "xray_score": 0.34,
  "error": "The uploaded image does not appear to be a chest X-ray. (detection score: 0.34 / threshold: 0.52)"
}
```

---

### POST `/api/chat`

**EN:** Send a health question to Pulmo AI chatbot.  
**VI:** Gửi câu hỏi sức khỏe đến chatbot Pulmo AI.

**Request:** `application/json`
```json
{
  "message": "What are the symptoms of bacterial pneumonia?"
}
```

**Response (200):**
```json
{
  "reply": "Viêm phổi do vi khuẩn thường biểu hiện bằng sốt cao, ho có đờm, đau ngực khi thở... Thông tin chỉ mang tính chất tham khảo và không thể thay thế bác sĩ."
}
```

> **Note:** Pulmo AI is powered by `gemini-3-flash-preview` with `temperature=0.3` and a specialized respiratory health system prompt. It is configured to provide informative, friendly, and concise responses (max 200 words), always reminding users to consult a doctor.

> **Lưu ý:** Pulmo AI sử dụng `gemini-3-flash-preview` với `temperature=0.3` và prompt hệ thống chuyên biệt về sức khỏe hô hấp. Được cấu hình để trả lời thân thiện, chính xác, ngắn gọn (tối đa 200 từ), luôn nhắc người dùng tham khảo bác sĩ.

---

## 🚀 Getting Started | Bắt Đầu

### Prerequisites | Yêu Cầu

- **Node.js** ≥ 18 & **npm** ≥ 9
- **Python** 3.10+
- **Angular CLI** (`npm install -g @angular/cli`)
- API Keys: **Google Gemini API Key**, **Hugging Face Token** (for private model download)

---

### Backend Setup | Cài Đặt Backend

```bash
# 1. Clone the repository | Clone repo
git clone https://github.com/joshhanson02/pulmo-vision-ai-lung-disease-detection.git
cd pulmo-vision-ai-lung-disease-detection/backend

# 2. Create virtual environment | Tạo môi trường ảo
python -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows

# 3. Install dependencies | Cài đặt thư viện
pip install -r requirements.txt

# 4. Create environment file | Tạo file môi trường
# Create a .env file with the following content:
# Tạo file .env với nội dung sau:
```

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
HF_TOKEN=your_huggingface_token_here
```

```bash
# 5. Run the backend server | Chạy backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Server will be available at | Server sẽ chạy tại:
# http://localhost:8000
# API docs (Swagger UI): http://localhost:8000/docs
```

> **Note | Lưu ý:** On first startup, the application automatically downloads `swin_best_model.pth` (~350MB) from Hugging Face Hub. Ensure you have a valid `HF_TOKEN`.  
> Lần đầu khởi động, ứng dụng tự động tải `swin_best_model.pth` (~350MB) từ Hugging Face Hub. Đảm bảo bạn có `HF_TOKEN` hợp lệ.

---

### Frontend Setup | Cài Đặt Frontend

```bash
# Navigate to frontend directory | Vào thư mục frontend
cd ../frontend

# Install dependencies | Cài đặt thư viện
npm install

# Run development server | Chạy server phát triển
npm start
# or: ng serve

# Application available at | Ứng dụng sẽ chạy tại:
# http://localhost:4200
```

> **Important | Quan trọng:** The frontend currently points to the production backend (`https://pulmo-backend-production-18a1.up.railway.app`). To use a local backend, update `apiUrl` in `frontend/src/app/services/xray-analysis.service.ts` and the CORS `allow_origins` in `backend/main.py` to include `http://localhost:4200`.

---

### Docker (Backend Only) | Docker (Chỉ Backend)

```bash
cd backend

# Build Docker image | Build image Docker
docker build -t pulmo-backend .

# Run container | Chạy container
docker run -p 8000:8000 \
  -e GEMINI_API_KEY=your_key_here \
  -e HF_TOKEN=your_token_here \
  pulmo-backend
```

---

## ☁️ Deployment | Triển Khai

### Backend → Railway

The backend includes a `Procfile` for Railway deployment:

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1 --timeout-keep-alive 120
```

Set the following environment variables in Railway:
- `GEMINI_API_KEY` — Your Google Gemini API key
- `HF_TOKEN` — Your Hugging Face access token

### Frontend → Vercel

The frontend includes a `vercel.json` that configures SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Deploy by connecting the `/frontend` directory to a Vercel project. All routes will fall back to `index.html` for Angular's client-side router.

---

## 📱 Application Pages | Các Trang Ứng Dụng

| Route | Page EN | Trang VI | Description |
|---|---|---|---|
| `/` | Landing Page | Trang chủ | Hero section, features overview |
| `/scan-xray` | Scan X-Ray | Quét X-Quang | Upload, validate, analyze X-ray images |
| `/lung-diseases` | Lung Diseases | Bệnh Phổi | Educational info on pneumonia types |
| `/about-us` | About Us | Giới Thiệu | Project & developer information |

---

## ⚠️ Medical Disclaimer | Tuyên Bố Miễn Trách Nhiệm Y Tế

> 🇬🇧 **EN:** This application is intended for **educational and research purposes only**. The AI analysis results are **not a substitute for professional medical diagnosis**. Always consult a qualified healthcare provider for medical advice, diagnosis, or treatment. The predictions made by this system may not be accurate and should not be used as the sole basis for any medical decision.

> 🇻🇳 **VI:** Ứng dụng này chỉ dành cho **mục đích giáo dục và nghiên cứu**. Kết quả phân tích AI **không thay thế chẩn đoán y tế chuyên nghiệp**. Hãy luôn tham khảo ý kiến bác sĩ hoặc chuyên gia y tế có thẩm quyền để được tư vấn, chẩn đoán hoặc điều trị. Các dự đoán của hệ thống có thể không chính xác và không nên là cơ sở duy nhất cho bất kỳ quyết định y tế nào.

---

## 📄 License | Giấy Phép

This project is open-source. Please refer to the repository for license details.  
Dự án này là mã nguồn mở. Vui lòng tham khảo repository để biết chi tiết giấy phép.

---

## 👨‍💻 Developer | Nhà Phát Triển

**Josh Chan (joshchan1301 / joshhanson02)**

- 🌐 Live App: [pulmo-vision.vercel.app](https://pulmo-vision.vercel.app)
- 🤗 Model on Hugging Face: [joshchan1301/x-ray_img_analysis_ai](https://huggingface.co/joshchan1301/x-ray_img_analysis_ai)
- 💻 GitHub: [github.com/joshhanson02](https://github.com/joshhanson02)

---

<div align="center">

**Built with ❤️ for better respiratory health awareness**  
**Xây dựng với ❤️ để nâng cao nhận thức về sức khỏe hô hấp**

</div>
