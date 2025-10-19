#!/bin/bash

# 数据库本地开发环境快速设置脚本

set -e

echo "🚀 开始设置数据库本地开发环境..."

# 检查是否安装了必要的工具
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 未安装，请先安装 $1"
        exit 1
    fi
}

echo "📋 检查必要工具..."
check_command "brew"
check_command "psql"
check_command "redis-cli"

# 启动数据库服务
echo "🔄 启动数据库服务..."
brew services start postgresql@15 2>/dev/null || echo "PostgreSQL 可能已经在运行"
brew services start redis 2>/dev/null || echo "Redis 可能已经在运行"

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 3

# 检查 PostgreSQL 连接
echo "🔍 检查 PostgreSQL 连接..."
if ! psql -h localhost -U postgres -d postgres -c "SELECT 1;" &>/dev/null; then
    echo "❌ PostgreSQL 连接失败，请检查配置"
    echo "💡 提示：确保已创建 postgres 用户并设置了密码"
    exit 1
fi

# 检查 Redis 连接
echo "🔍 检查 Redis 连接..."
if ! redis-cli ping | grep -q "PONG"; then
    echo "❌ Redis 连接失败，请检查配置"
    exit 1
fi

# 创建数据库（如果不存在）
echo "🗄️  创建数据库..."
psql -h localhost -U postgres -d postgres -c "CREATE DATABASE chatbot_db;" 2>/dev/null || echo "数据库可能已存在"

# 进入后端目录
cd packages/backend

# 检查环境文件
if [ ! -f ".env" ]; then
    echo "⚠️  未找到 .env 文件，请参考 docs/database-setup.md 创建环境配置文件"
    echo "📝 创建 .env 文件..."
    cat > .env << EOF
# Environment Configuration
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/chatbot_db"
REDIS_URL="redis://localhost:6379"

# Server Configuration
PORT=3000
HOST=localhost
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"

# JWT Configuration
JWT_SECRET="dev-super-secret-jwt-key-for-local-development"
JWT_EXPIRES_IN="7d"

# AI Service Configuration
QWEN_API_KEY="your-qwen-api-key-here"
QWEN_API_URL="https://dashscope.aliyuncs.com/api/v1"
QWEN_MODEL="qwen-turbo"

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./uploads"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL="debug"
LOG_FILE="./logs/app.log"

# Email Configuration (Optional)
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
FROM_EMAIL=""

# Analytics (Optional)
ANALYTICS_ENABLED=false
ANALYTICS_KEY=""
EOF
    echo "✅ 已创建 .env 文件"
fi

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 生成 Prisma 客户端
echo "🔧 生成 Prisma 客户端..."
pnpm db:generate

# 推送数据库模式
echo "📊 推送数据库模式..."
pnpm db:push

echo "✅ 数据库本地开发环境设置完成！"
echo ""
echo "🎯 下一步："
echo "   1. 启动开发服务器: pnpm dev"
echo "   2. 打开 Prisma Studio: pnpm db:studio"
echo "   3. 查看 API 文档: http://localhost:3000/api/docs"
echo ""
echo "📚 更多信息请查看: docs/database-setup.md"
