#!/bin/bash

# Railway build script for EdgeFlow Capital Backend

echo "🚀 Building EdgeFlow Capital Backend..."

# Install dependencies
npm install

# Build the application
npm run build

# Initialize database
echo "📊 Initializing database..."
npm run db:migrate
npm run db:seed

echo "✅ Build completed successfully!"