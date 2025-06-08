#!/bin/bash

echo "🚀 Checking deployment readiness for Vercel..."
echo ""

# Check if build works
echo "📦 Testing production build..."
if pnpm build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

# Check for environment variables
echo ""
echo "🔑 Checking environment variables..."
if [ -f .env.local ]; then
    echo "✅ .env.local found"
    if grep -q "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" .env.local; then
        echo "✅ Google Maps API key is set"
    else
        echo "⚠️  Google Maps API key not found in .env.local"
    fi
else
    echo "⚠️  .env.local not found. Make sure to set environment variables in Vercel dashboard."
fi

# Check if .env.local is ignored
echo ""
echo "🔒 Checking Git ignore..."
if grep -q ".env.local" .gitignore; then
    echo "✅ .env.local is properly ignored"
else
    echo "❌ WARNING: .env.local is not in .gitignore!"
fi

# Check required files
echo ""
echo "📄 Checking required files..."
required_files=("package.json" "next.config.js" "vercel.json")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
    fi
done

# Summary
echo ""
echo "📋 Summary:"
echo "- Make sure to set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in Vercel dashboard"
echo "- Your app will be deployed to: https://[project-name].vercel.app"
echo "- Custom domains can be added in Vercel settings"
echo ""
echo "Ready to deploy! Follow the instructions in DEPLOY_VERCEL.md"