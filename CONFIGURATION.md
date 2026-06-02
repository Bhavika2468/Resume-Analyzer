# AI Resume Analyzer - Configuration Guide

## Quick Start Configuration

### 1. API Key Setup

The application requires a Google Gemini API key for resume analysis.

**Getting Your API Key:**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key
5. Paste it into your `.env` file

```bash
GEMINI_API_KEY=AIzaSyD... (your key here)
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Required
GEMINI_API_KEY=your_api_key_here

# Optional (have defaults)
FLASK_ENV=development          # or production
FLASK_DEBUG=1                  # Enable debug mode
HOST=0.0.0.0
PORT=5000
MAX_FILE_SIZE=10485760        # 10MB in bytes
UPLOAD_FOLDER=uploads
```

### 3. File Structure Verification

Ensure this structure before running:

```
AI Resume Analyzer/
├── app.py
├── requirements.txt
├── .env                    (create this)
├── templates/
│   └── index.html
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── assets/
└── uploads/
    └── .gitkeep
```

## Development Configuration

### Local Setup

```bash
# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env file
copy .env.example .env

# 4. Add your GEMINI_API_KEY to .env

# 5. Run application
python app.py
```

### Debug Mode

Enable detailed error messages:

```bash
# Windows (PowerShell)
$env:FLASK_DEBUG = "1"
python app.py

# macOS/Linux
export FLASK_DEBUG=1
python app.py

# Or in .env
FLASK_DEBUG=1
FLASK_ENV=development
```

### Testing

Test the application:

```bash
# Test file upload
curl -X POST -F "file=@sample.pdf" http://localhost:5000/upload

# Test health check
curl http://localhost:5000/health
```

## Production Configuration

### Security Settings

```bash
# .env production settings
FLASK_ENV=production
FLASK_DEBUG=0

# Add security headers
SECRET_KEY=your-secret-key-here

# Restrict CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

### Performance Tuning

#### Gunicorn Workers

```bash
# Calculate optimal worker count: (2 × CPU cores) + 1
# For 2-core machine: 5 workers

gunicorn -w 5 -b 0.0.0.0:5000 app:app
```

#### Timeout Settings

```bash
# For large file processing
gunicorn --timeout 120 -w 4 -b 0.0.0.0:5000 app:app
```

#### Worker Class

```bash
# Use sync (default) for CPU-bound tasks
# Use gevent for I/O-bound tasks

pip install gevent
gunicorn -w 4 -k gevent -b 0.0.0.0:5000 app:app
```

### Database Configuration (Future)

```bash
# PostgreSQL example
DATABASE_URL=postgresql://user:password@localhost/resume_analyzer

# MySQL example
DATABASE_URL=mysql+pymysql://user:password@localhost/resume_analyzer

# SQLite (development)
DATABASE_URL=sqlite:///resume_analyzer.db
```

### Caching Configuration (Optional)

```bash
# Redis caching
CACHE_TYPE=redis
CACHE_REDIS_URL=redis://localhost:6379/0

# Or Memcached
CACHE_TYPE=memcached
CACHE_MEMCACHED_SERVERS=['127.0.0.1:11211']
```

## Deployment Specific Configurations

### Render.com

Environment variables in dashboard:
- `GEMINI_API_KEY`: Your API key
- `FLASK_ENV`: production
- `PYTHON_VERSION`: 3.11

Start command:
```bash
gunicorn app:app
```

### Railway.app

Environment variables:
- `GEMINI_API_KEY`: Your API key
- `PORT`: 5000 (auto-set)
- `PYTHON_VERSION`: 3.11

### PythonAnywhere

WSGI file configuration:
```python
import os
os.environ['GEMINI_API_KEY'] = 'your_key'

from app import app
application = app
```

### AWS EC2

Systemd service with environment file:

```ini
[Service]
EnvironmentFile=/etc/resume-analyzer/.env
ExecStart=/var/www/resume-analyzer/venv/bin/gunicorn app:app
```

## Advanced Configuration

### Custom PDF Processing

Modify `MAX_FILE_SIZE` in requirements:

```python
# In app.py
app.config['MAX_CONTENT_LENGTH'] = 20 * 1024 * 1024  # 20MB
```

### Custom AI Prompts

Edit the prompt in `analyze_with_gemini()` function for different analysis styles.

### Logging Configuration

```python
# Add to app.py
import logging
from logging.handlers import RotatingFileHandler

handler = RotatingFileHandler('app.log', maxBytes=10000000, backupCount=10)
handler.setLevel(logging.INFO)
app.logger.addHandler(handler)
```

### CORS Configuration

```python
# Add to app.py
from flask_cors import CORS

CORS(app, resources={r"/api/*": {"origins": "*"}})
```

## Troubleshooting Configuration

### Issue: "API Key not working"

```bash
# Verify key format
# Should look like: AIzaSyD... (about 40 characters)

# Check if using correct key
# Make sure you used Create API Key, not OAuth

# Test key
python -c "import google.generativeai as genai; genai.configure(api_key='YOUR_KEY')"
```

### Issue: "Upload folder permission denied"

```bash
# Fix permissions
chmod -R 755 uploads/

# Or create with proper permissions
sudo mkdir -p uploads
sudo chown www-data:www-data uploads
sudo chmod 755 uploads
```

### Issue: "Module not found"

```bash
# Verify virtual environment
which python  # or where python

# Reinstall requirements
pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
```

### Issue: "Port 5000 already in use"

```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
python app.py --port 5001
# Update FLASK_PORT=5001 in .env
```

## System Requirements

### Minimum
- Python 3.9+
- 512MB RAM
- 100MB disk space

### Recommended
- Python 3.11+
- 2GB RAM
- 500MB disk space
- 2GB free disk (for uploads and caching)

### Optimal (Production)
- Python 3.11+
- 4GB RAM
- 2GB disk space (+ SSD recommended)
- 5GB free disk
- 2+ CPU cores

## Performance Metrics

Typical response times:

- Page load: 1-2 seconds
- PDF upload: 2-5 seconds
- AI analysis: 5-15 seconds (API dependent)
- Job matching: 5-10 seconds
- Report generation: 1-3 seconds

## Monitoring Configuration

### Application Health

```bash
# Check health endpoint
curl http://localhost:5000/health

# Response:
# {"status": "healthy", "timestamp": "2024-01-15T..."}
```

### Log Monitoring

```bash
# Watch application logs
tail -f app.log

# Search for errors
grep ERROR app.log

# Count requests by endpoint
grep "POST /upload" app.log | wc -l
```

## Updates & Maintenance

### Update Dependencies

```bash
# Check for updates
pip list --outdated

# Update specific package
pip install --upgrade Flask

# Update all packages
pip install --upgrade -r requirements.txt
```

### Backup Configuration

```bash
# Backup .env file
cp .env .env.backup

# Backup database (if using)
mysqldump database_name > backup.sql
```

## Security Hardening

### API Key Protection

✓ Never commit `.env` to git
✓ Use environment variables in production
✓ Rotate keys regularly
✓ Restrict API key permissions

### File Upload Security

✓ Only PDF files allowed
✓ Max 10MB file size
✓ Files deleted after processing
✓ Secure filename handling

### Web Security

✓ HTTPS in production
✓ Security headers enabled
✓ Rate limiting configured
✓ Input validation enabled

## FAQ

**Q: Can I change the port?**
A: Yes, set `PORT=8000` in .env or run `python app.py --port 8000`

**Q: How do I increase upload size?**
A: Change `MAX_CONTENT_LENGTH` in app.py or `MAX_FILE_SIZE` in .env

**Q: Is my resume data saved?**
A: No, files are deleted after analysis. Only analysis results are returned.

**Q: Can I use a different AI model?**
A: Yes, modify `genai.GenerativeModel()` in app.py

**Q: How many concurrent users can it handle?**
A: With default settings, about 10-20. Scale with more workers/instances.

---

For more information, see README.md and DEPLOYMENT_GUIDE.md
