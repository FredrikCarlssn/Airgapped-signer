#!/bin/bash

# Check if pnpm is installed
if command -v pnpm &> /dev/null; then
    echo "✅ pnpm is already installed!"
    pnpm --version
    exit 0
fi

echo "⏳ Installing pnpm..."

# Check if npm is available (required to install pnpm)
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is required to install pnpm. Please install Node.js first."
    echo "Download Node.js from: https://nodejs.org/"
    exit 1
fi

# Install pnpm using npm
npm install -g pnpm

# Verify installation
if command -v pnpm &> /dev/null; then
    echo "✅ pnpm has been successfully installed!"
    pnpm --version
else
    echo "❌ Failed to install pnpm. Please try installing it manually:"
    echo "npm install -g pnpm"
    exit 1
fi

echo ""
echo "You can now run './deploy.sh' to deploy the broadcaster to GitHub Pages." 