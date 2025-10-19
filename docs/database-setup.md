# 数据库本地开发环境配置指南

## 1. 环境配置文件

由于 `.env` 文件被 git 忽略，你需要手动创建环境配置文件：

### 在 `packages/backend/` 目录下创建 `.env` 文件：

```bash
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
```

## 2. PostgreSQL 数据库安装和配置

### macOS 安装 PostgreSQL

```bash
# 使用 Homebrew 安装
brew install postgresql@15

# 启动 PostgreSQL 服务
brew services start postgresql@15

# 创建数据库用户和数据库
psql postgres
```

### 在 PostgreSQL 中执行以下命令：

```sql
-- 创建用户（如果不存在）
CREATE USER postgres WITH PASSWORD 'password';

-- 创建数据库
CREATE DATABASE chatbot_db;

-- 授权
GRANT ALL PRIVILEGES ON DATABASE chatbot_db TO postgres;

-- 退出
\q
```

### 验证数据库连接：

```bash
# 测试连接
psql -h localhost -U postgres -d chatbot_db
```

## 3. Redis 安装和配置

### macOS 安装 Redis

```bash
# 使用 Homebrew 安装
brew install redis

# 启动 Redis 服务
brew services start redis

# 验证 Redis 运行
redis-cli ping
# 应该返回 PONG
```

## 4. 数据库迁移和初始化

### 生成 Prisma 客户端

```bash
cd packages/backend
pnpm db:generate
```

### 推送数据库模式

```bash
pnpm db:push
```

### 或者使用迁移（推荐用于生产环境）

```bash
pnpm db:migrate
```

## 5. 验证配置

### 启动后端服务

```bash
cd packages/backend
pnpm dev
```

### 检查数据库连接

服务启动后，检查控制台输出是否有数据库连接错误。

## 6. 数据库管理工具

### Prisma Studio（推荐）

```bash
cd packages/backend
pnpm db:studio
```

这将打开一个 Web 界面来管理数据库。

### 其他工具

- **pgAdmin**: PostgreSQL 的图形化管理工具
- **TablePlus**: 支持多种数据库的现代化工具
- **DBeaver**: 免费的通用数据库工具

## 7. 常见问题

### 连接被拒绝

1. 确保 PostgreSQL 服务正在运行
2. 检查端口 5432 是否被占用
3. 验证用户名和密码是否正确

### 数据库不存在

1. 确保已创建 `chatbot_db` 数据库
2. 检查用户权限

### Redis 连接失败

1. 确保 Redis 服务正在运行
2. 检查端口 6379 是否可用

## 8. 开发环境快速启动脚本

创建 `scripts/dev-setup.sh`：

```bash
#!/bin/bash

echo "启动数据库服务..."
brew services start postgresql@15
brew services start redis

echo "等待服务启动..."
sleep 3

echo "生成 Prisma 客户端..."
cd packages/backend
pnpm db:generate

echo "推送数据库模式..."
pnpm db:push

echo "启动开发服务器..."
pnpm dev
```

使用方法：

```bash
chmod +x scripts/dev-setup.sh
./scripts/dev-setup.sh
```
