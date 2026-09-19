#!/usr/bin/env bash
set -e

echo "🚀 Starting Tour Help Desk update..."

# 1. Pull latest changes from git
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# 2. Build Backend
echo "🔨 Building Backend..."
cd backend
npm install
npm run build
cd ..

# 3. Build Frontend
echo "🔨 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# 4. Restart PM2 processes gracefully with zero downtime
echo "🔄 Reloading PM2 processes..."
pm2 reload ecosystem.config.cjs

echo "✅ Tour Help Desk updated and running successfully!"
pm2 status
