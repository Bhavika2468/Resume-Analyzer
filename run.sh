#!/bin/bash

# AI Resume Analyzer - Unix/macOS Startup Script
# ===============================================

echo ""
echo "========================================"
echo "AI Resume Analyzer - Startup"
echo "========================================"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "Virtual environment created!"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

# Check for .env file
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  .env file not found!"
    echo "Please create .env file with your GEMINI_API_KEY:"
    echo ""
    echo "GEMINI_API_KEY=your_google_gemini_api_key_here"
    echo ""
    echo "Creating .env from template..."
    cp .env.example .env
    echo ""
    echo "Now edit .env and add your API key!"
    exit 1
fi

# Clear screen
clear

# Start the application
echo ""
echo "========================================"
echo "Starting AI Resume Analyzer..."
echo "========================================"
echo ""
echo "✓ Application is running!"
echo "✓ Open browser and go to: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python app.py
