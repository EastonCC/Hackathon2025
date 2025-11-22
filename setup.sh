#!/bin/bash

echo "🚀 Setting up Valdosta Medicine Desktop App..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Install root dependencies
echo "📦 Installing Electron..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Electron dependencies"
    exit 1
fi
echo "✓ Electron installed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✓ Backend dependencies installed"
echo ""

# Seed database
echo "🗄️  Creating database..."
npm run seed
if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi
echo "✓ Database created"
cd ..
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✓ Frontend dependencies installed"
echo ""

# Build frontend
echo "🔨 Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build frontend"
    exit 1
fi
echo "✓ Frontend built"
cd ..
echo ""

echo "✅ Setup complete!"
echo ""
echo "To run the desktop app:"
echo "  npm start"
echo ""
echo "To build installers:"
echo "  npm run build:win   (Windows)"
echo "  npm run build:mac   (macOS)"
echo "  npm run build:linux (Linux)"
