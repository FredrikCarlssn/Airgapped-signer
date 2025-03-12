#!/bin/bash

# Build and deploy to GitHub Pages

echo "Building and deploying the transaction broadcaster to GitHub Pages..."

# Detect package manager
if command -v pnpm &> /dev/null; then
    echo "✅ Using pnpm for deployment (recommended)"
    # Install dependencies if needed
    pnpm install
    
    # Build and deploy
    pnpm run deploy
else
    echo "⚠️ pnpm not found, falling back to npm"
    echo "For best results, consider installing pnpm: https://pnpm.io/installation"
    # Install dependencies if needed
    npm install
    
    # Build and deploy
    npm run deploy
fi

echo ""
echo "✨ Deployment complete! Your application should be available at:"
echo "📱 https://fredrikcarlssn.github.io/Airgapped-signer/"
echo ""
echo "Note: It may take a few minutes for changes to appear on GitHub Pages." 