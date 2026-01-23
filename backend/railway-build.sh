#!/bin/bash

# Railway build script for PropTrade Pro Backend

echo "🚀 Building PropTrade Pro Backend..."

# Install dependencies
npm install

# Build the application
npm run build

# Initialize database
echo "📊 Initializing database..."
npm run db:migrate
npm run db:seed

echo "✅ Build completed successfully!"