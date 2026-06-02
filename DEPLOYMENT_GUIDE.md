# 🚀 AI Resume Analyzer - Deployment Guide

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Render.com](#rendercom)
4. [Railway.app](#railwayapp)
5. [PythonAnywhere](#pythonanywhere)
6. [AWS EC2](#aws-ec2)
7. [Vercel (Frontend Only)](#vercel-frontend-only)
8. [Troubleshooting](#troubleshooting)

---

## Local Development

### Prerequisites
- Python 3.9+
- pip
- Virtual Environment

### Setup Steps

```bash
# 1. Clone/Extract project
cd "AI Resume Analyzer"

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file
copy .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 6. Run application
python app.py

# 7. Open browser
# Visit http://localhost:5000
```

---

## Docker Deployment

### Prerequisites
- Docker installed
- Docker Compose (optional)

### Using Docker Compose (Recommended)

```bash
# 1. Create .env file
copy .env.example .env
# Edit and add your GEMINI_API_KEY

# 2. Build and run
docker-compose up --build

# 3. Access application
# http://localhost

# 4. Stop containers
docker-compose down
```

### Using Docker Only

```bash
# 1. Build image
docker build -t resume-analyzer .

# 2. Run container
docker run -p 5000:5000 \
  -e GEMINI_API_KEY=your_key_here \
  -v $(pwd)/uploads:/app/uploads \
  resume-analyzer

# 3. Access application
# http://localhost:5000
```

---

## Render.com

### Step-by-Step Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/resume-analyzer.git
   git push -u origin main
   ```

2. **Create Render Account**
   - Visit [Render.com](https://render.com)
   - Sign up with GitHub

3. **Create Web Service**
   - Dashboard → New → Web Service
   - Select your GitHub repository
   - Configure:
     - **Name**: `resume-analyzer`
     - **Runtime**: Python 3.11
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn app:app`
     - **Instance Type**: Free

4. **Add Environment Variables**
   - Environment → Add Environment Variable
   - `GEMINI_API_KEY`: Your API key
   - `PYTHON_VERSION`: 3.11

5. **Deploy**
   - Click Deploy
   - Wait for build (2-5 minutes)
   - Get your URL

### Post-Deployment

```bash
# Monitor logs
# View in Render dashboard

# Update code
git push origin main
# Render automatically redeploys
```

---

## Railway.app

### Step-by-Step Deployment

1. **Push to GitHub** (same as Render)

2. **Create Railway Account**
   - Visit [Railway.app](https://railway.app)
   - Sign up with GitHub

3. **Create New Project**
   - New Project → GitHub Repo → Select Repository

4. **Add Environment Variables**
   - Variables tab
   - Add: `GEMINI_API_KEY`

5. **Configure Start Command**
   - Service Settings → Start Command
   - `gunicorn app:app`

6. **Deploy**
   - Click Deploy
   - Generate domain

### Monitoring

```bash
# View logs in Railway dashboard
# Real-time monitoring available
# Auto-redeploy on git push
```

---

## PythonAnywhere

### Step-by-Step Deployment

1. **Create Account**
   - Visit [PythonAnywhere.com](https://www.pythonanywhere.com)
   - Sign up (free tier available)

2. **Upload Files**
   - Dashboard → Files
   - Upload project files
   - Or use git: `git clone https://github.com/yourusername/resume-analyzer.git`

3. **Create Virtual Environment**
   ```bash
   # In PythonAnywhere bash console
   mkvirtualenv --python=/usr/bin/python3.10 myenv
   workon myenv
   pip install -r requirements.txt
   ```

4. **Create Web App**
   - Web tab → Add new web app
   - Choose Python 3.10
   - Choose Flask
   - Path: `/home/username/resume-analyzer`

5. **Configure WSGI File**
   - Web tab → WSGI configuration file
   - Edit to:
   ```python
   import sys
   path = '/home/username/resume-analyzer'
   if path not in sys.path:
       sys.path.append(path)

   from app import app
   application = app
   ```

6. **Add Environment Variables**
   - Web tab → Environment variables
   - Add: `GEMINI_API_KEY`

7. **Reload Web App**
   - Click "Reload"
   - Your app is live!

---

## AWS EC2

### Step-by-Step Deployment

1. **Create EC2 Instance**
   - Instance Type: `t2.micro` (free tier eligible)
   - OS: Ubuntu 22.04 LTS
   - Security Group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt upgrade -y
   sudo apt install python3-pip python3-venv nginx git -y
   ```

4. **Clone Project**
   ```bash
   cd /var/www
   sudo git clone https://github.com/yourusername/resume-analyzer.git
   cd resume-analyzer
   ```

5. **Setup Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

6. **Create Systemd Service**
   ```bash
   sudo nano /etc/systemd/system/resume-analyzer.service
   ```
   
   Add:
   ```ini
   [Unit]
   Description=Resume Analyzer
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/var/www/resume-analyzer
   Environment="PATH=/var/www/resume-analyzer/venv/bin"
   Environment="GEMINI_API_KEY=your_key_here"
   ExecStart=/var/www/resume-analyzer/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:app
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

7. **Enable Service**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable resume-analyzer
   sudo systemctl start resume-analyzer
   sudo systemctl status resume-analyzer
   ```

8. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/resume-analyzer
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

9. **Enable Nginx Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/resume-analyzer /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **Setup SSL (Optional)**
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d your-domain.com
    ```

---

## Vercel (Frontend Only)

*Note: This deploys only frontend. Backend must be deployed separately.*

1. **Extract Frontend Files**
   ```bash
   mkdir resume-analyzer-frontend
   cp templates/index.html resume-analyzer-frontend/
   cp static/ resume-analyzer-frontend/ -r
   ```

2. **Create `vercel.json`**
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ],
     "env": {
       "API_URL": "@api_url"
     }
   }
   ```

3. **Push to GitHub**
   ```bash
   cd resume-analyzer-frontend
   git init
   git add .
   git commit -m "Initial"
   git push
   ```

4. **Deploy to Vercel**
   - Visit [Vercel.com](https://vercel.com)
   - Import GitHub repository
   - Set environment variable: `API_URL=your-backend-url`
   - Deploy

---

## Troubleshooting

### Issue: Port Already in Use

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

### Issue: ModuleNotFoundError

```bash
# Verify virtual environment is activated
pip list  # Should show Flask, google-generativeai, etc.

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Issue: GEMINI_API_KEY Not Found

```bash
# Verify .env file exists and is correct
cat .env

# For Docker
docker run -e GEMINI_API_KEY=your_key ...

# For PythonAnywhere
# Check Web tab → Environment variables
```

### Issue: 413 Request Entity Too Large

**Solution:** File size exceeds 10MB limit. Compress PDF or upload smaller file.

### Issue: 502 Bad Gateway (Nginx)

```bash
# Check backend status
sudo systemctl status resume-analyzer

# View logs
sudo journalctl -u resume-analyzer -n 50

# Restart service
sudo systemctl restart resume-analyzer
```

### Issue: Timeout on Job Analysis

**Solution:** API calls can take 10-30 seconds. This is normal. Increase timeout:

```python
# In app.py, modify:
@app.route('/analyze-job-match', methods=['POST'])
def analyze_job_match_route():
    request.environ['werkzeug.request'].timeout = 60
```

---

## Performance Optimization

### Enable Caching
```python
# In app.py
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/health')
@cache.cached(timeout=60)
def health_check():
    ...
```

### Enable Gzip Compression
```python
from flask_compress import Compress
Compress(app)
```

### Use CDN for Static Files
```html
<!-- In index.html -->
<link rel="stylesheet" href="https://cdn.example.com/static/css/style.css">
```

---

## Security Checklist

- [ ] GEMINI_API_KEY in environment variables (not in code)
- [ ] CSRF protection enabled
- [ ] File upload validation enabled
- [ ] SQL injection prevention (using parameterized queries)
- [ ] XSS protection headers added
- [ ] HTTPS enabled (production)
- [ ] Rate limiting configured
- [ ] Input sanitization implemented

---

## Monitoring & Logging

### Local Development
```bash
# Enable debug logs
FLASK_DEBUG=1 python app.py
```

### Production
```bash
# Gunicorn logging
gunicorn --access-logfile - --error-logfile - app:app

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Cost Estimation

| Platform | Free Tier | Estimated Cost/Month |
|----------|-----------|----------------------|
| Render | 150 hrs | $5-20 |
| Railway | 5GB | $5-15 |
| PythonAnywhere | Limited | $5-25 |
| AWS EC2 | t2.micro 750hrs | $0-10 |
| Heroku | Discontinued | N/A |

---

## Next Steps

1. Choose deployment platform
2. Follow step-by-step guide
3. Set environment variables
4. Deploy and test
5. Monitor performance
6. Scale as needed

For questions, refer to README.md or respective platform documentation.
