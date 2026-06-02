# Multi-stage build for optimized image
FROM python:3.11-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements-production.txt .

# Install Python dependencies
RUN pip install --user --no-cache-dir -r requirements-production.txt

# Final stage
FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies from builder
COPY --from=builder /root/.local /root/.local

# Copy application files
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Set environment variables
ENV PATH=/root/.local/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    FLASK_APP=app.py

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5000/health')"

# Expose port
EXPOSE 5000

# Run application with gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "-w", "4", "--timeout", "60", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
