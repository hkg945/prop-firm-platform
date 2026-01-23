#!/bin/bash

# Railway build script
set -e

echo "🚀 Building PropTrade Pro Backend for Railway..."

# Install dependencies
npm ci --only=production

# Build the application
npm run build

# Initialize database if needed
if [ ! -f "data.db" ]; then
  echo "📊 Initializing database..."
  npx tsx src/db/migrate.ts 2>/dev/null || echo "Migration not needed"
  npx tsx src/db/seed.ts 2>/dev/null || echo "Seeding not needed"
fi

echo "✅ Railway build completed successfully!"