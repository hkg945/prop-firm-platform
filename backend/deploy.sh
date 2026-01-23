#!/usr/bin/env bash

# Railway deployment script
set -e

echo "🚀 Starting Railway deployment..."

# Install dependencies
npm ci --only=production

# Build the application
npm run build

# Initialize database (if needed)
if [ ! -f "data.db" ]; then
  echo "📊 Initializing database..."
  npm run db:migrate
  npm run db:seed
fi

echo "✅ Deployment preparation complete!"