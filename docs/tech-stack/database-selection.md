# 数据库技术选型文档

## 概述

本文档专门针对数据库技术选型进行详细分析和对比，重点关注关系型数据库和 ORM 框架的选择。

## 数据库技术选型

### 技术方案对比

| 技术方案       | 优势                                      | 劣势                             | 学习价值   | 适用场景           |
| -------------- | ----------------------------------------- | -------------------------------- | ---------- | ------------------ |
| **SQLite**     | • 轻量级<br>• 零配置<br>• 跨平台          | • 并发性能有限<br>• 功能相对简单 | ⭐⭐⭐⭐   | 本地存储和原型开发 |
| **PostgreSQL** | • 功能强大<br>• 扩展性好<br>• 开源免费    | • 配置复杂<br>• 资源占用较大     | ⭐⭐⭐⭐⭐ | 生产环境应用       |
| **MongoDB**    | • 文档存储<br>• 灵活 schema<br>• 水平扩展 | • 内存占用大<br>• 事务支持有限   | ⭐⭐⭐     | 非关系型数据存储   |
| **Redis**      | • 高性能<br>• 内存存储<br>• 丰富数据结构  | • 持久化复杂<br>• 数据量限制     | ⭐⭐⭐     | 缓存和会话存储     |

### 最终选择：SQLite (开发) + PostgreSQL (生产)

**选择理由：**

1. **开发阶段**：SQLite 提供快速开发和测试环境
2. **生产环境**：PostgreSQL 提供企业级特性和性能
3. **学习价值**：学习关系型数据库设计和优化
4. **成本控制**：SQLite 零成本，PostgreSQL 开源免费

## 详细对比分析

### SQLite 特点

**优势：**

- **零配置**：无需安装和配置数据库服务器
- **轻量级**：单个文件存储，体积小
- **跨平台**：支持所有主流操作系统
- **SQL 兼容**：标准 SQL 语法，学习成本低
- **嵌入式**：可直接嵌入应用程序中

**劣势：**

- **并发限制**：写操作是串行的，并发性能有限
- **功能限制**：不支持某些高级 SQL 特性
- **网络访问**：不支持网络访问，只能本地使用
- **数据类型**：数据类型支持相对简单

**适用场景：**

- 开发测试环境
- 小型应用
- 移动应用本地存储
- 嵌入式系统

### PostgreSQL 特点

**优势：**

- **功能强大**：支持复杂查询、窗口函数、JSON 数据类型
- **标准兼容**：高度符合 SQL 标准
- **扩展性好**：支持多种扩展和自定义函数
- **事务支持**：完整的 ACID 事务支持
- **开源免费**：无商业许可限制

**劣势：**

- **配置复杂**：需要专业的数据库管理知识
- **资源占用**：内存和存储需求较高
- **学习曲线**：高级特性学习成本较高
- **运维复杂**：需要专业的数据库管理员

**适用场景：**

- 生产环境应用
- 复杂业务逻辑
- 大数据量处理
- 企业级应用

### MongoDB 特点

**优势：**

- **文档存储**：灵活的文档结构，无需预定义 schema
- **水平扩展**：天然支持分片和集群
- **查询灵活**：支持复杂的查询和聚合操作
- **开发效率**：JSON 格式，与 JavaScript 集成良好

**劣势：**

- **内存占用大**：需要大量内存来缓存数据
- **事务支持有限**：直到 4.0 版本才支持多文档事务
- **一致性模型**：最终一致性，可能不适合某些场景
- **学习成本**：NoSQL 概念需要重新学习

### Redis 特点

**优势：**

- **高性能**：内存存储，读写速度极快
- **丰富数据结构**：字符串、列表、集合、哈希、有序集合
- **持久化支持**：RDB 和 AOF 两种持久化方式
- **发布订阅**：支持消息发布订阅模式

**劣势：**

- **内存限制**：数据存储在内存中，容量有限
- **持久化复杂**：需要合理配置持久化策略
- **成本高**：内存成本比磁盘存储高
- **数据丢失风险**：断电可能导致数据丢失

## ORM 框架选型

### ORM 方案对比

| ORM 方案      | 优势                                                  | 劣势                                | 学习价值   | 适用场景          |
| ------------- | ----------------------------------------------------- | ----------------------------------- | ---------- | ----------------- |
| **Prisma**    | • 现代化设计<br>• TypeScript 支持<br>• 直观的查询 API | • 相对较新<br>• 生态较小            | ⭐⭐⭐⭐⭐ | 现代 Node.js 应用 |
| **TypeORM**   | • 功能丰富<br>• 装饰器语法<br>• 活跃社区              | • 配置复杂<br>• 性能问题            | ⭐⭐⭐⭐   | TypeScript 项目   |
| **Sequelize** | • 成熟稳定<br>• 功能完整<br>• 社区活跃                | • API 复杂<br>• TypeScript 支持有限 | ⭐⭐⭐     | 传统 Node.js 应用 |
| **Knex.js**   | • 轻量级<br>• 查询构建器<br>• 灵活                    | • 功能相对简单<br>• 类型支持有限    | ⭐⭐⭐     | 简单项目          |

### 最终选择：Prisma

**选择理由：**

1. **现代化设计**：专为现代 Node.js 和 TypeScript 设计
2. **类型安全**：完整的 TypeScript 类型支持
3. **开发体验**：直观的查询 API 和强大的工具链
4. **代码生成**：自动生成类型定义和客户端代码
5. **迁移管理**：内置数据库迁移和版本管理

## 数据库设计方案

### 1. 数据模型设计

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sessions  ChatSession[]
  messages  Message[]
}

model ChatSession {
  id        String   @id @default(cuid())
  title     String
  userId    String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages  Message[]
}

model Message {
  id        String      @id @default(cuid())
  content   String
  role      MessageRole
  sessionId String
  userId    String
  metadata  Json?
  createdAt DateTime    @default(now())

  session   ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}
```

### 2. 数据库服务层

```typescript
// src/services/database.service.ts
import { PrismaClient } from "@prisma/client";

export class DatabaseService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // 用户相关操作
  async createUser(userData: CreateUserData) {
    return await this.prisma.user.create({
      data: userData,
    });
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  // 会话相关操作
  async createSession(userId: string, title: string) {
    return await this.prisma.chatSession.create({
      data: {
        title,
        userId,
      },
    });
  }

  async getUserSessions(userId: string) {
    return await this.prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  // 消息相关操作
  async createMessage(messageData: CreateMessageData) {
    return await this.prisma.message.create({
      data: messageData,
    });
  }

  async getSessionMessages(sessionId: string) {
    return await this.prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });
  }

  async deleteMessage(messageId: string) {
    return await this.prisma.message.delete({
      where: { id: messageId },
    });
  }

  // 清理资源
  async disconnect() {
    await this.prisma.$disconnect();
  }
}
```

### 3. 数据库迁移管理

```typescript
// 迁移脚本示例
// prisma/migrations/001_initial_schema.sql
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
```

## 开发环境配置

### 1. 环境变量配置

```bash
# .env
# 开发环境 - SQLite
DATABASE_URL="file:./dev.db"

# 生产环境 - PostgreSQL
# DATABASE_URL="postgresql://username:password@localhost:5432/chatbot_db"

# 其他配置
NODE_ENV=development
PORT=3000
```

### 2. Prisma 配置

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "ts-node prisma/seed.ts",
    "db:reset": "prisma migrate reset"
  }
}
```

### 3. 数据库初始化

```typescript
// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 创建测试用户
  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      username: "testuser",
      password: "hashed_password",
    },
  });

  console.log("Seed data created:", testUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 性能优化策略

### 1. 索引优化

```sql
-- 为常用查询字段创建索引
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_session_user_id ON "ChatSession"(userId);
CREATE INDEX idx_message_session_id ON "Message"(sessionId);
CREATE INDEX idx_message_created_at ON "Message"(createdAt);
```

### 2. 查询优化

```typescript
// 优化前：N+1 查询问题
async getSessionsWithMessages(userId: string) {
  const sessions = await this.prisma.chatSession.findMany({
    where: { userId },
  });

  // 这会导致 N+1 查询问题
  for (const session of sessions) {
    session.messages = await this.prisma.message.findMany({
      where: { sessionId: session.id },
    });
  }

  return sessions;
}

// 优化后：使用 include 一次性查询
async getSessionsWithMessages(userId: string) {
  return await this.prisma.chatSession.findMany({
    where: { userId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}
```

### 3. 连接池配置

```typescript
// src/database/connection.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

// 连接池配置
if (process.env.NODE_ENV === "production") {
  prisma.$connect();
}

export default prisma;
```

## 数据备份和恢复

### 1. 备份策略

```bash
# PostgreSQL 备份
pg_dump -h localhost -U username -d chatbot_db > backup_$(date +%Y%m%d_%H%M%S).sql

# SQLite 备份
cp dev.db backup_$(date +%Y%m%d_%H%M%S).db
```

### 2. 恢复策略

```bash
# PostgreSQL 恢复
psql -h localhost -U username -d chatbot_db < backup_20231201_120000.sql

# SQLite 恢复
cp backup_20231201_120000.db dev.db
```

## 学习路径建议

### 第一阶段：数据库基础

1. **SQL 基础**：查询、插入、更新、删除操作
2. **关系型数据库概念**：表、索引、约束、关系
3. **数据库设计**：范式、ER 图、数据建模
4. **事务管理**：ACID 特性、隔离级别

### 第二阶段：ORM 框架

1. **Prisma 基础**：Schema 定义、查询构建
2. **数据迁移**：版本管理、数据迁移策略
3. **关系管理**：一对多、多对多关系处理
4. **性能优化**：查询优化、索引设计

### 第三阶段：生产实践

1. **数据库运维**：备份恢复、监控告警
2. **性能调优**：慢查询分析、索引优化
3. **安全防护**：SQL 注入防护、权限管理
4. **扩展性设计**：读写分离、分库分表

## 总结

SQLite + PostgreSQL + Prisma 的组合是当前项目的最佳数据库解决方案：

1. **开发效率**：SQLite 提供零配置的开发环境
2. **生产稳定**：PostgreSQL 提供企业级数据库特性
3. **现代化**：Prisma 提供类型安全的 ORM 体验
4. **学习价值**：掌握现代数据库设计和 ORM 使用
5. **成本控制**：开源免费，无商业许可限制

这个组合既能满足开发阶段的需求，又能支撑生产环境的稳定运行。
