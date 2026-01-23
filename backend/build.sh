#!/bin/bash

# Build the application
npm run build

# Ensure database file exists
touch data.db

# Initialize database
npm run db:migrate
npm run db:seed

echo "Build completed successfully"