# 🚀 AI Resume Analyzer - Quick Reference Card

## 📱 QUICK START (Choose Your Platform)

### Windows Users
```bash
run.bat
# Follow prompts, add your Gemini API key
```

### Mac/Linux Users
```bash
bash run.sh
# Follow prompts, add your Gemini API key
```

### Manual (All Platforms)
```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Create .env with GEMINI_API_KEY
python app.py
```

**Then visit:** `http://localhost:5000`

---

## 🔑 GET YOUR API KEY IN 2 MINUTES

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click **"Create API Key"**
4. Copy the key
5. Paste into `.env` file:
   ```
   GEMINI_API_KEY=AIzaSyD...
   ```

---

## 📁 FILE LOCATIONS

| File | Location | Purpose |
|------|----------|---------|
| Frontend | `templates/index.html` | Main UI |
| Styling | `static/css/style.css` | Dark theme, animations |
| Logic | `static/js/script.js` | Upload, analysis, export |
| Backend | `app.py` | Server, API, Gemini |
| Config | `.env` | API key, settings |

---

## 🎯 MAIN FEATURES

1. **📤 Upload Resume** - Drag & drop PDF
2. **🤖 ATS Analysis** - Score 0-100
3. **🧠 AI Analysis** - Gemini-powered insights
4. **💼 Job Matcher** - Compare with job descriptions
5. **📊 Skill Analysis** - Identify gaps
6. **💡 Recommendations** - Career advice
7. **📥 Export** - PDF & JSON reports

---

## 🌐 DEPLOYMENT (ONE COMMAND)

### Render (Easiest)
1. Push code to GitHub
2. Visit `render.com` → New Web Service
3. Connect GitHub repo
4. Add `GEMINI_API_KEY` environment variable
5. Deploy (auto-updates on git push)

### Docker
```bash
docker-compose up --build
# Visit http://localhost
```

### Other Platforms
See `DEPLOYMENT_GUIDE.md` for:
- Railway.app
- PythonAnywhere
- AWS EC2
- DigitalOcean
- VPS

---

## 🔧 COMMON COMMANDS

| Task | Windows | Mac/Linux |
|------|---------|----------|
| Create venv | `python -m venv venv` | `python3 -m venv venv` |
| Activate venv | `venv\Scripts\activate` | `source venv/bin/activate` |
| Install deps | `pip install -r requirements.txt` | Same |
| Run app | `python app.py` | `python3 app.py` |
| Check Python | `python --version` | `python3 --version` |
| Kill port 5000 | `netstat -ano \| findstr :5000` | `lsof -i :5000` |

---

## 📊 API ENDPOINTS

```
POST /upload
- Upload PDF resume
- Returns: Analysis with ATS scores, AI insights

POST /analyze-job-match
- Compare with job description
- Returns: Match score, recommendations

GET /health
- Check server status
- Returns: Status OK
```

---

## 🎨 CUSTOMIZATION QUICK TIPS

### Change Colors (Neon Purple to Blue)
In `style.css`, find:
```css
--neon-purple: #b366ff;
--neon-blue: #00d4ff;
```
Edit color codes to your preference.

### Change Title
In `index.html`, find:
```html
<span>Resume Analyzer</span>
```
Replace with your company name.

### Adjust Animation Speed
In `style.css`, find:
```css
--transition-base: 300ms ease;
```
Change 300 to faster (200) or slower (500).

---

## 🐛 QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "API Key Invalid" | Check .env file, restart app |
| "Port 5000 in use" | Kill process or use different port |
| "Module not found" | Run `pip install -r requirements.txt` |
| "Upload fails" | File too large? Max 10MB |
| "Page won't load" | Check `static/` folder exists |

---

## 📱 RESPONSIVE DESIGN

- **Desktop** (1200px+) - Full sidebar + content
- **Tablet** (768px-1199px) - Grid layout changes
- **Mobile** (under 768px) - Stacked layout, hamburger menu

All automatically handled by CSS media queries.

---

## ⚡ PERFORMANCE TIPS

1. **Faster Uploads** - Keep PDFs under 5MB
2. **Faster Analysis** - Simple resumes analyze faster
3. **Better Scores** - Include keywords, use action verbs
4. **Smooth UI** - Uses CSS animations, not JavaScript

---

## 🔒 SECURITY NOTES

✅ **Do:**
- Keep API key in `.env` file
- Don't commit `.env` to git
- Rotate API keys regularly
- Use HTTPS in production

❌ **Don't:**
- Put API key in code
- Share API key
- Commit secrets to git
- Use API key in frontend

---

## 📚 DOCUMENTATION FILES

| File | Purpose |
|------|---------|
| `README.md` | Features, setup, deployment |
| `DEPLOYMENT_GUIDE.md` | Platform-specific steps |
| `CONFIGURATION.md` | Environment, security, tuning |
| `SETUP_CHECKLIST.md` | Verify installation |
| `PROJECT_SUMMARY.md` | File structure, overview |
| `QUICK_REFERENCE.md` | This file |

---

## 🚀 DEPLOYMENT CHECKLIST

Before deploying:
- [ ] API key obtained
- [ ] `.env` file created
- [ ] App tested locally (`python app.py`)
- [ ] No errors in browser console
- [ ] Upload works
- [ ] Analysis works
- [ ] Chosen deployment platform
- [ ] Created account on platform

---

## 💻 SYSTEM REQUIREMENTS

**Minimum:**
- Python 3.9+
- 512MB RAM
- 100MB disk space

**Recommended:**
- Python 3.11+
- 2GB RAM
- 500MB disk space

**Production:**
- Python 3.11+
- 4GB RAM
- 2+ CPU cores
- SSD recommended

---

## 📞 GETTING HELP

1. **Local Issues**
   - Check CONFIGURATION.md
   - Check SETUP_CHECKLIST.md
   - Check code comments

2. **Deployment Issues**
   - Check DEPLOYMENT_GUIDE.md
   - Check platform documentation
   - Check error logs

3. **Feature Questions**
   - Check README.md
   - Check app.py comments
   - Check index.html comments

---

## 🎯 SUCCESS METRICS

Your setup is working when:
- ✅ App runs without errors
- ✅ Page loads at localhost:5000
- ✅ Dark theme visible
- ✅ Upload zone clickable
- ✅ Can select PDF file
- ✅ Analysis displays scores
- ✅ Can export PDF/JSON
- ✅ No console errors

---

## 🎉 YOU'RE READY!

1. ✅ Setup complete
2. ✅ Local testing done
3. ✅ Ready to deploy
4. ✅ Ready to share

**Next:** Follow DEPLOYMENT_GUIDE.md to go live!

---

**Questions? Check the docs. Code issues? Check comments. Still stuck? Read README.md!**

**Happy analyzing! 🚀**
