@echo off
REM AI Resume Analyzer - Windows Startup Script
REM ============================================

echo.
echo ========================================
echo AI Resume Analyzer - Startup
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo Virtual environment created!
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/update dependencies
echo.
echo Installing dependencies...
pip install -r requirements.txt

REM Check for .env file
if not exist ".env" (
    echo.
    echo ⚠️  .env file not found!
    echo Please create .env file with your GEMINI_API_KEY:
    echo.
    echo GEMINI_API_KEY=your_google_gemini_api_key_here
    echo.
    echo You can copy .env.example to .env:
    copy .env.example .env
    echo.
    echo Now edit .env and add your API key!
    pause
    exit /b 1
)

REM Clear screen
cls

REM Start the application
echo.
echo ========================================
echo Starting AI Resume Analyzer...
echo ========================================
echo.
echo ✓ Application is running!
echo ✓ Open browser and go to: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

python app.py
