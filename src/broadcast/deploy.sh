#!/bin/bash

# Build and deploy to GitHub Pages

echo "Building and deploying the transaction broadcaster to GitHub Pages..."

# Install dependencies if needed
pnpm install

# Build and deploy
npm run deploy

echo "Deployment complete! Your application should be available at:"
echo "https://YOUR_GITHUB_USERNAME.github.io/Airgapped-signer/"
echo ""
echo "Remember to replace 'YOUR_GITHUB_USERNAME' with your actual GitHub username in:"
echo "1. package.json (homepage field)"
echo "2. This deploy script output"
echo ""
echo "Note: It may take a few minutes for changes to appear on GitHub Pages." 