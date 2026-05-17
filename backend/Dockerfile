FROM python:3.10-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt các thư viện hệ thống cần thiết cho OpenCV / Xử lý ảnh
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Nâng cấp pip
RUN pip install --no-upgrade pip

# Cài đặt riêng bản PyTorch CPU trước để tận dụng cache Docker
RUN pip install --no-cache-dir \
    torch==2.1.0+cpu \
    --index-url https://download.pytorch.org/whl/cpu

# Copy file requirements và cài đặt các thư viện FastAPI còn lại
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở cổng mạng kết nối với Railway
EXPOSE 8000

# Lệnh khởi chạy hệ thống
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
