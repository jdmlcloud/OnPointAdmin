#!/bin/bash

echo "🚀 Starting build process..."

# Set environment variables
export NODE_ENV=production
export DYNAMODB_REGION=us-east-1

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"

# List build artifacts
echo "📁 Build artifacts:"
ls -la .next/
