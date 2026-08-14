# Stage 1: Build React Frontend
# Node 20 LTS — Node 18 reached end-of-life in April 2025.
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
# `npm ci` installs exactly the lockfile, so the deployed bundle matches what
# was tested locally; it falls back to `npm install` when no lockfile is present.
RUN npm ci || npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python FastAPI Backend + Embedded Frontend Static App
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies (tesseract-ocr for OCR, libgl for OpenCV)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    tesseract-ocr \
    tesseract-ocr-vie \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy built frontend dist into FastAPI static directory
COPY --from=frontend-builder /app/frontend/dist /app/app/static

# Hugging Face Spaces default port is 7860
EXPOSE 7860

ENV PORT=7860
ENV PYTHONPATH=/app

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
