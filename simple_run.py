#!/usr/bin/env python3
"""
Simple one-click launcher for AI Resume Analyzer
Just run: python simple_run.py
"""

import os
import sys
import webbrowser
import time
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Set up environment
os.environ.setdefault('FLASK_ENV', 'development')
os.environ.setdefault('FLASK_DEBUG', '1')

# Check for .env file
if not os.path.exists('.env'):
    print("\n" + "="*60)
    print("⚠️  ERROR: .env file not found!")
    print("="*60)
    print("\nPlease create .env file:")
    print("\n1. Open .env.example file")
    print("2. Add your Gemini API key:")
    print("   GEMINI_API_KEY=AIzaSyD...your_key_here")
    print("3. Save as .env")
    print("\nGet API key from:")
    print("   https://makersuite.google.com/app/apikey")
    print("\n" + "="*60 + "\n")
    input("Press Enter to exit...")
    sys.exit(1)

# Load .env
from dotenv import load_dotenv
load_dotenv()

# Check if API key is set
api_key = os.environ.get('GEMINI_API_KEY')
if not api_key or api_key == 'your_google_gemini_api_key_here':
    print("\n" + "="*60)
    print("⚠️  ERROR: Invalid API Key!")
    print("="*60)
    print("\n.env file exists but GEMINI_API_KEY is not set correctly")
    print("\nPlease edit .env and add:")
    print("   GEMINI_API_KEY=AIzaSyD...your_actual_key_here")
    print("\nGet key from:")
    print("   https://makersuite.google.com/app/apikey")
    print("\n" + "="*60 + "\n")
    input("Press Enter to exit...")
    sys.exit(1)

print("\n" + "="*60)
print("🧠 AI RESUME ANALYZER")
print("="*60)
print("✓ Starting application...")
print("✓ Opening browser in 2 seconds...")
print("="*60 + "\n")

# Import and run Flask app
from app import app

# Open browser automatically
def open_browser():
    time.sleep(2)
    webbrowser.open('http://127.0.0.1:5001')

# Start browser thread
import threading
thread = threading.Thread(target=open_browser, daemon=True)
thread.start()

# Run Flask app
print("🚀 Server running at: http://127.0.0.1:5001\n")
try:
    app.run(debug=True, use_reloader=False, host='127.0.0.1', port=5001)
except KeyboardInterrupt:
    print("\n✓ Server stopped")
    sys.exit(0)
