#!/bin/bash

# Daznode GitBook Community Platform - Build Script
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

log "🚀 Building Daznode GitBook Community Platform"

# Check Node.js
if ! node --version >/dev/null 2>&1; then
    error "Node.js is not installed"
fi

# Build backend
log "📦 Building backend..."
cd src/backend

# Generate package-lock.json
log "Generating package-lock.json..."
npm install --package-lock-only

# Install dependencies
log "Installing backend dependencies..."
npm install --production=false

# Type check
log "Running TypeScript type checking..."
npx tsc --noEmit

# Build
log "Building backend application..."
npm run build

cd ../..

# Build frontend
log "📦 Building frontend components..."
cd src/frontend

# Generate package-lock.json
log "Generating package-lock.json for frontend..."
npm install --package-lock-only

# Install dependencies
log "Installing frontend dependencies..."
npm install --production=false

# Type check
log "Running frontend type checking..."
npx tsc --noEmit

# Build
log "Building frontend components..."
npm run build

cd ../..

# Create production builds
log "📦 Creating production builds..."

# Create dist directory
mkdir -p dist

# Copy backend dist
cp -r src/backend/dist dist/backend
cp src/backend/package.json dist/
cp src/backend/package-lock.json dist/

# Copy frontend dist
mkdir -p dist/frontend
cp -r src/frontend/build/* dist/frontend/ 2>/dev/null || cp -r src/frontend/dist/* dist/frontend/ 2>/dev/null || warning "Frontend build directory not found"

# Copy infrastructure
cp -r src/infrastructure dist/

# Copy environment template
cp .env.example dist/

# Copy deployment scripts
cp deploy.sh dist/
cp DEPLOYMENT.md dist/
chmod +x dist/deploy.sh

log "✅ Build completed successfully!"
log "📁 Production files available in ./dist/"
log "🚀 Ready to deploy with: cd dist && ./deploy.sh"