# ✅ AI Resume Analyzer - Setup Verification Checklist

Use this checklist to verify your setup before running the application.

## 📋 Pre-Installation

- [ ] Python 3.9 or higher installed
  ```bash
  python --version
  # Should show: Python 3.9+ (e.g., Python 3.11.0)
  ```

- [ ] pip is accessible
  ```bash
  pip --version
  # Should show: pip X.X.X
  ```

- [ ] Git installed (optional, for version control)
  ```bash
  git --version
  ```

## 📁 File Structure

Verify these files exist:

- [ ] `app.py` - Flask backend
- [ ] `requirements.txt` - Python dependencies
- [ ] `templates/index.html` - HTML template
- [ ] `static/css/style.css` - CSS styling
- [ ] `static/js/script.js` - JavaScript code
- [ ] `README.md` - Documentation
- [ ] `DEPLOYMENT_GUIDE.md` - Deployment instructions
- [ ] `CONFIGURATION.md` - Configuration guide
- [ ] `.env.example` - Environment template

```bash
# Verify file count
ls -la  # Unix/Mac
dir     # Windows
```

## 🔧 Virtual Environment Setup

- [ ] Virtual environment created
  ```bash
  python -m venv venv
  ```

- [ ] Virtual environment activated
  ```bash
  # Windows
  venv\Scripts\activate
  
  # Mac/Linux
  source venv/bin/activate
  
  # Should show (venv) in terminal
  ```

- [ ] `pip` upgraded to latest
  ```bash
  pip install --upgrade pip
  ```

## 📦 Dependencies Installation

- [ ] Dependencies installed
  ```bash
  pip install -r requirements.txt
  ```

- [ ] Installation successful
  ```bash
  pip list
  # Should show: Flask, PyPDF2, google-generativeai, etc.
  ```

- [ ] Verify key packages
  ```bash
  python -c "import flask; import PyPDF2; import google.generativeai"
  # Should run without errors
  ```

## 🔑 API Key Setup

- [ ] Gemini API key obtained
  - [ ] Visited https://makersuite.google.com/app/apikey
  - [ ] Created API key
  - [ ] Key copied (format: AIzaSyD... or similar)

- [ ] `.env` file created
  ```bash
  # Copy from template
  cp .env.example .env  # Mac/Linux
  copy .env.example .env  # Windows
  ```

- [ ] `.env` file configured
  ```bash
  # Edit .env file with your editor
  # Add: GEMINI_API_KEY=your_api_key_here
  
  # Verify file exists
  cat .env  # Mac/Linux
  type .env  # Windows
  ```

- [ ] API key is valid
  ```bash
  python -c "
  import google.generativeai as genai
  genai.configure(api_key='YOUR_KEY_HERE')
  print('API Key Valid!')
  "
  ```

## 📂 Directory Permissions

- [ ] `uploads` folder writable
  ```bash
  # Mac/Linux
  chmod 755 uploads
  
  # Verify
  ls -ld uploads
  ```

- [ ] All files readable
  ```bash
  # Mac/Linux
  chmod 644 app.py requirements.txt
  ```

## 🚀 Pre-Run Verification

- [ ] Flask can be imported
  ```bash
  python -c "from flask import Flask; print('Flask OK')"
  ```

- [ ] All modules can be imported
  ```bash
  python -c "
  from flask import Flask
  import PyPDF2
  import google.generativeai as genai
  print('All modules OK')
  "
  ```

- [ ] Templates directory accessible
  ```bash
  # Verify index.html exists
  ls templates/index.html  # Mac/Linux
  dir templates\index.html  # Windows
  ```

- [ ] Static files accessible
  ```bash
  # Verify CSS and JS exist
  ls static/css/style.css
  ls static/js/script.js
  ```

## ✅ Quick Run Test

- [ ] Application starts without errors
  ```bash
  python app.py
  # Should show: Running on http://127.0.0.1:5000
  ```

- [ ] Home page loads
  - [ ] Open browser to http://localhost:5000
  - [ ] Page loads without errors
  - [ ] Logo and title visible

- [ ] UI elements visible
  - [ ] Navigation bar present
  - [ ] Upload zone visible
  - [ ] Sidebar navigation present

- [ ] No console errors
  - [ ] Open browser DevTools (F12)
  - [ ] Check Console tab
  - [ ] No red error messages

- [ ] Static files loading
  - [ ] CSS styles applied (dark theme visible)
  - [ ] Fonts loaded correctly
  - [ ] Icons displayed

## 📝 Test Upload (Optional)

- [ ] Sample PDF available
  - [ ] Find or create a PDF resume
  - [ ] File is under 10MB

- [ ] Upload works
  - [ ] Drag & drop or click upload
  - [ ] File uploads without error
  - [ ] Analysis starts

- [ ] Analysis completes
  - [ ] Scores appear
  - [ ] AI analysis displays
  - [ ] No errors in console

## 🔒 Security Checklist

- [ ] `.env` file NOT in git
  - [ ] `.env` added to `.gitignore`
  - [ ] `.env` not committed

- [ ] No API keys in code
  - [ ] app.py doesn't contain API key
  - [ ] index.html doesn't contain API key
  - [ ] script.js doesn't contain API key

- [ ] Uploads folder secure
  - [ ] Files deleted after processing
  - [ ] No sensitive data stored

## 🌐 Deployment Preparation

- [ ] GitHub repository created (optional)
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  ```

- [ ] README.md understood
  - [ ] Read README.md
  - [ ] Understood features
  - [ ] Know how to use app

- [ ] Deployment platform chosen
  - [ ] Render / Railway / PythonAnywhere / AWS / etc.
  - [ ] Account created
  - [ ] API key ready for deployment

- [ ] Deployment guide reviewed
  - [ ] Read DEPLOYMENT_GUIDE.md
  - [ ] Chose deployment method
  - [ ] Followed steps for platform

## 🐛 Troubleshooting

If any checklist item fails, try:

1. **Python/pip issues**
   ```bash
   python --version  # Check Python
   pip list  # Check installed packages
   ```

2. **Module not found**
   ```bash
   pip install -r requirements.txt --force-reinstall
   ```

3. **API key not working**
   - [ ] Verify key format (AIzaSyD...)
   - [ ] Check no extra spaces in .env
   - [ ] Try key in https://makersuite.google.com/app/apikey

4. **Port 5000 in use**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -i :5000
   kill -9 <PID>
   ```

5. **Upload not working**
   - [ ] Check uploads folder exists
   - [ ] Check file permissions (755)
   - [ ] Check file size < 10MB

6. **UI not loading**
   - [ ] Check static files exist
   - [ ] Check CSS path correct
   - [ ] Check JS path correct
   - [ ] Hard refresh browser (Ctrl+Shift+R)

## ✨ Final Verification

- [ ] **All items checked** ✅
- [ ] **Ready to deploy!** 🚀

## 📞 Support

If you encounter issues:

1. Check **README.md** - Features and setup
2. Check **CONFIGURATION.md** - Configuration help
3. Check **DEPLOYMENT_GUIDE.md** - Deployment issues
4. Check code comments in:
   - app.py (backend logic)
   - script.js (frontend logic)
   - style.css (styling)

## 🎉 Next Steps

1. **Local Testing** - Use checklist above
2. **Customize** - Edit colors/text as needed
3. **Deploy** - Follow DEPLOYMENT_GUIDE.md
4. **Monitor** - Check logs and performance
5. **Share** - Share with others or make public

---

**You're all set! Ready to analyze resumes with AI? 🚀**
