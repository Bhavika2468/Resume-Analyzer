#!/usr/bin/env python3
"""
Test script to verify AI Resume Analyzer setup
"""

import sys
import os

def test_python():
    """Test Python version"""
    print("\n✓ Python Version Test")
    version = sys.version_info
    print(f"  Python {version.major}.{version.minor}.{version.micro}")
    if version.major >= 3 and version.minor >= 9:
        print("  ✓ Version OK (3.9+)")
        return True
    else:
        print("  ✗ Python 3.9+ required!")
        return False

def test_imports():
    """Test required imports"""
    print("\n✓ Testing Imports")
    
    modules = {
        'flask': 'Flask',
        'PyPDF2': 'PyPDF2',
        'google.generativeai': 'Google Generative AI'
    }
    
    all_ok = True
    for module, name in modules.items():
        try:
            __import__(module)
            print(f"  ✓ {name}")
        except ImportError as e:
            print(f"  ✗ {name} - {str(e)}")
            all_ok = False
    
    return all_ok

def test_env():
    """Test environment variables"""
    print("\n✓ Environment Variables Test")
    
    api_key = os.environ.get('GEMINI_API_KEY')
    if api_key:
        print(f"  ✓ GEMINI_API_KEY found")
        if api_key.startswith('AIzaSy'):
            print(f"  ✓ API key format looks correct")
            return True
        else:
            print(f"  ⚠️  API key format might be wrong (should start with 'AIzaSy')")
            return True
    else:
        print(f"  ✗ GEMINI_API_KEY not found!")
        print(f"  → Create .env file with: GEMINI_API_KEY=your_key_here")
        return False

def test_files():
    """Test required files"""
    print("\n✓ Files Structure Test")
    
    files = [
        'app.py',
        'templates/index.html',
        'static/css/style.css',
        'static/js/script.js',
        'requirements.txt'
    ]
    
    all_ok = True
    for file in files:
        if os.path.exists(file):
            size = os.path.getsize(file)
            print(f"  ✓ {file} ({size} bytes)")
        else:
            print(f"  ✗ {file} NOT FOUND!")
            all_ok = False
    
    return all_ok

def test_flask_app():
    """Test Flask app loads"""
    print("\n✓ Flask App Test")
    
    try:
        from flask import Flask
        app = Flask(__name__)
        print(f"  ✓ Flask app created successfully")
        
        # Try to load the actual app
        from app import app as resume_app
        print(f"  ✓ Resume analyzer app loaded")
        return True
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("="*50)
    print("🧪 AI RESUME ANALYZER - SETUP TEST")
    print("="*50)
    
    tests = [
        ("Python Version", test_python),
        ("Required Imports", test_imports),
        ("Environment Variables", test_env),
        ("File Structure", test_files),
        ("Flask App", test_flask_app)
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n✗ {name} - Unexpected error: {e}")
            results.append((name, False))
    
    print("\n" + "="*50)
    print("📋 SUMMARY")
    print("="*50)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✓" if result else "✗"
        print(f"{status} {name}")
    
    print(f"\nResult: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Ready to run: python app.py")
    else:
        print("\n⚠️  Some tests failed. Fix issues above and try again.")
    
    print("="*50 + "\n")
    
    return passed == total

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
