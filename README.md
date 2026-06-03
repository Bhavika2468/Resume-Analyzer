# 🧠 AI Resume Analyzer - Production Ready SaaS

A modern, premium SaaS-style web application that analyzes resumes using AI and provides ATS scoring, job matching, keyword analysis, skill gap detection, and improvement suggestions.

![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0+-red?style=flat-square&logo=flask)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🌟 Features

### 📊 ATS Analysis
- **ATS Score** - Optimized for Applicant Tracking Systems
- **Readability Score** - Formatting and structure analysis
- **Keyword Optimization Score** - Relevant keyword detection
- Detailed scoring breakdown

### 🤖 AI-Powered Analysis
- Resume summary and overview
- Strengths identification
- Weaknesses and gaps detection
- Missing keywords suggestion
- Skill gap analysis
- Job role recommendations
- Career path suggestions
- Smart improvement engine

### 💼 Job Matching
- Compare resume against job descriptions
- Match score calculation
- Identify matching skills
- Find missing skills
- Personalized recommendations

### 📈 Skill Analysis
- Current skills display
- Missing skills identification
- Skill proficiency levels
- Skill gap visualization

### 💡 Smart Recommendations
- Best job roles based on skills
- Career growth paths
- Skills to learn next
- Bullet point improvements

### 📥 Export & Reports
- Download PDF reports
- Export JSON data
- Shareable analysis results

## 🎨 Design Features

- **Premium UI** - Inspired by Linear, Notion, Vercel, and Stripe
- **Dark Theme** - Easy on the eyes, modern appearance
- **Glassmorphism** - Modern frosted glass effect
- **Neon Gradients** - Blue-purple color scheme
- **Smooth Animations** - Professional transitions
- **Fully Responsive** - Mobile, tablet, desktop
- **Material Design** - Clean, organized layout
- **Interactive Charts** - Circular progress indicators

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- pip (Python package manager)
- Google Gemini API Key (free)

### Installation

1. **Clone/Download the project**
```bash
cd "AI Resume Analyzer"
```

2. **Create a virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
# Create a .env file in the root directory
GEMINI_API_KEY=your_google_gemini_api_key_here
FLASK_ENV=development
```

**Get your Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy and paste the key into your `.env` file

5. **Run the application**
```bash
python app.py
```

6. **Open in browser**
```
http://localhost:5000
```

## 📁 Project Structure

```
AI Resume Analyzer/
│
├── templates/
│   └── index.html              # Main HTML template
│
├── static/
│   ├── css/
│   │   └── style.css           # Premium CSS styling
│   ├── js/
│   │   └── script.js           # Frontend JavaScript
│   └── assets/                 # Images, fonts, etc.
│
├── uploads/                    # Temporary PDF storage
│
├── app.py                      # Flask backend (main)
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (create locally)
└── README.md                   # This file
```

## 💻 Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Premium styling with animations
- **JavaScript (ES6+)** - Interactivity and API calls
- **PDF.js** - PDF handling
- **html2pdf.js** - PDF report generation

### Backend
- **Flask 3.0** - Lightweight web framework
- **Python 3.9+** - Server-side logic
- **PyPDF2** - PDF text extraction
- **Google Generative AI** - Gemini API integration

### AI
- **Google Gemini Pro** - Advanced AI analysis

## 🔧 API Endpoints

### POST `/upload`
Upload and analyze a resume PDF.

**Request:**
- File: PDF (max 10MB)

**Response:**
```json
{
    "success": true,
    "analysis": {
        "ats_score": 85,
        "readability_score": 90,
        "keyword_optimization_score": 80,
        "resume_summary": "...",
        "skills": ["Python", "Flask", ...],
        "strengths": ["..."],
        "weaknesses": ["..."],
        ...
    }
}
```

### POST `/analyze-job-match`
Analyze resume against a job description.

**Request:**
```json
{
    "job_description": "Job description text...",
    "resume_data": { analyzed_resume_data }
}
```

**Response:**
```json
{
    "success": true,
    "analysis": {
        "match_score": 75,
        "matching_skills": ["..."],
        "missing_skills": ["..."],
        "recommendations": ["..."]
    }
}
```

### GET `/health`
Health check endpoint.

## 🌐 Deployment

### Option 1: Render (Recommended)

1. **Push code to GitHub**
2. **Create account on [Render.com](https://render.com)**
3. **New Web Service** → Connect GitHub repository
4. **Configure:**
   - Runtime: Python 3.9+
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
5. **Add Environment Variables:**
   - `GEMINI_API_KEY`: Your API key
   - `PYTHON_VERSION`: 3.11

### Option 2: Railway.app

1. **Push code to GitHub**
2. **Create account on [Railway.app](https://railway.app)**
3. **New Project** → GitHub Repository
4. **Add Variables:**
   - `GEMINI_API_KEY`: Your API key
5. **Deploy**

### Option 3: PythonAnywhere

1. **Create account on [PythonAnywhere.com](https://www.pythonanywhere.com)**
2. **Upload files via Web Console**
3. **Create Virtual Environment**
4. **Add Web App** → Flask + Python
5. **Configure WSGI file**
6. **Add Environment Variables**

### Option 4: Docker (Local/Cloud)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
```

```bash
docker build -t resume-analyzer .
docker run -p 5000:5000 -e GEMINI_API_KEY=your_key resume-analyzer
```

### Option 5: Traditional VPS (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install python3-pip python3-venv nginx -y

# Clone project
cd /var/www
git clone your-repo
cd resume-analyzer

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Install Gunicorn
pip install gunicorn

# Create systemd service
sudo nano /etc/systemd/system/resume-analyzer.service
```

**Service file content:**
```ini
[Unit]
Description=AI Resume Analyzer
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/resume-analyzer
Environment="PATH=/var/www/resume-analyzer/venv/bin"
Environment="GEMINI_API_KEY=your_key"
ExecStart=/var/www/resume-analyzer/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable resume-analyzer
sudo systemctl start resume-analyzer
```

## 📊 Performance Optimization

- **Lazy loading** - Images and components load on demand
- **CSS optimization** - Minified for production
- **JavaScript bundling** - Efficient file loading
- **Caching** - Browser caching for static assets
- **Compression** - Gzip compression for responses
- **CDN ready** - Static files can be served from CDN

## 🔐 Security Features

- **File validation** - Only PDF files accepted
- **File size limits** - Max 10MB per upload
- **Secure filename handling** - Protection against path traversal
- **CORS ready** - Configure as needed
- **Error handling** - Secure error messages
- **Input validation** - All inputs validated

## 🚀 Performance Metrics

- **Page Load Time** - < 2 seconds
- **Analysis Time** - 5-10 seconds (depending on Gemini API)
- **PDF Upload** - < 5 seconds
- **Mobile Responsive** - Optimized for all screen sizes

## 🎯 Usage Tips

1. **Best Results:**
   - Use well-formatted PDF resumes
   - Include all relevant sections (skills, experience, education)
   - Use standard industry keywords

2. **ATS Optimization:**
   - Use specific keywords from job descriptions
   - Include technical skills and tools
   - Use action verbs in bullet points

3. **Job Matching:**
   - Paste complete job descriptions
   - Include all requirements
   - Review recommendations carefully

## 🐛 Troubleshooting

**Issue: "API Key Invalid"**
- Verify your Gemini API key is correct
- Check it's properly set in `.env` file
- Restart the application

**Issue: "PDF Upload Fails"**
- Ensure file is valid PDF
- Check file size (max 10MB)
- Try re-saving the PDF

**Issue: "Analysis Takes Too Long"**
- API might be processing
- Wait 30 seconds before retrying
- Check internet connection

**Issue: "Port 5000 Already in Use"**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

## 📝 Environment Variables

```bash
# Required
GEMINI_API_KEY=your_google_gemini_api_key

# Optional
FLASK_ENV=development  # or production
FLASK_DEBUG=1          # Enable debug mode (development only)
MAX_FILE_SIZE=10485760 # Max upload size in bytes
```

## 🎓 Learning Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Google Gemini API](https://ai.google.dev/)
- [PyPDF2 Documentation](https://pypdf2.readthedocs.io/)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)

## 📄 License

MIT License - Free for personal and commercial use

## 🎉 What's Next?

Future enhancements:
- Multiple language support
- LinkedIn integration
- Portfolio integration
- Cover letter generator
- Interview prep module
- Real-time collaboration
- Analytics dashboard
- Team features

---

**Made with ❤️ by Bhavika for career growth**
