#!/bin/bash

# Backend Development Environment Startup Script

echo "🚀 Starting Backend Development Environment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from env.example..."
    if [ -f ../env.example ]; then
        cp ../env.example .env
        echo "✅ .env file created from env.example"
        echo "📝 Please update .env with your actual configuration values"
    else
        echo "❌ env.example file not found. Please create .env manually"
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Check if Prisma client is generated
if [ ! -d "node_modules/.prisma" ]; then
    echo "🗄️  Generating Prisma client..."
    pnpm db:generate
fi

# Create logs directory if it doesn't exist
mkdir -p logs

echo "🔧 Environment checks completed"
echo "🌐 Starting development server..."
echo "📊 Health check: http://localhost:3000/health"
echo "🗄️  Database test: http://localhost:3000/test-db"
echo ""

# Start the development server
pnpm dev
