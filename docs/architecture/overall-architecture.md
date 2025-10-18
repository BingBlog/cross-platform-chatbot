# 跨平台 AI Chatbot 整体架构设计

## 项目概述

基于技术选型文档，设计一套完整的跨平台 AI Chatbot 系统架构，实现一套代码多端复用的解决方案。

## 整体架构图

```mermaid
graph TB
    subgraph "客户端层 (Client Layer)"
        A[Electron 桌面端<br/>macOS/Windows/Linux]
        B[React Native 移动端<br/>Android/iOS]
        C[React Web 端<br/>浏览器]
    end

    subgraph "共享代码层 (Shared Code Layer)"
        D[业务逻辑层<br/>Business Logic]
        E[数据模型层<br/>Data Models]
        F[API 客户端层<br/>API Client]
        G[AI 集成层<br/>AI Integration]
        H[状态管理层<br/>State Management]
        I[UI 组件库<br/>UI Components]
    end

    subgraph "平台适配层 (Platform Adapter Layer)"
        J[桌面端适配器<br/>Desktop Adapter]
        K[移动端适配器<br/>Mobile Adapter]
        L[Web 端适配器<br/>Web Adapter]
    end

    subgraph "后端服务层 (Backend Service Layer)"
        M[API 网关<br/>API Gateway]
        N[业务服务<br/>Business Services]
        O[AI 服务<br/>AI Services]
        P[用户服务<br/>User Services]
        Q[会话服务<br/>Chat Services]
    end

    subgraph "数据层 (Data Layer)"
        R[PostgreSQL<br/>生产数据库]
        S[SQLite<br/>开发数据库]
        T[Redis<br/>缓存层]
        U[文件存储<br/>File Storage]
    end

    subgraph "外部服务 (External Services)"
        V[QWEN API<br/>AI 模型服务]
        W[文件存储服务<br/>Cloud Storage]
    end

    A --> J
    B --> K
    C --> L

    J --> D
    K --> D
    L --> D

    D --> E
    D --> F
    D --> G
    D --> H
    D --> I

    F --> M
    G --> O

    M --> N
    M --> O
    M --> P
    M --> Q

    N --> R
    N --> S
    O --> T
    P --> R
    Q --> R

    O --> V
    U --> W
```

## 项目目录结构设计

```
cross-platform-chatbot/
├── packages/                          # 多包管理结构
│   ├── shared/                        # 共享代码包
│   │   ├── src/
│   │   │   ├── business/              # 业务逻辑层
│   │   │   │   ├── chat/              # 聊天业务逻辑
│   │   │   │   ├── user/              # 用户业务逻辑
│   │   │   │   ├── session/           # 会话管理逻辑
│   │   │   │   └── ai/                # AI 集成逻辑
│   │   │   ├── models/                # 数据模型层
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── chat.model.ts
│   │   │   │   ├── session.model.ts
│   │   │   │   └── message.model.ts
│   │   │   ├── api/                   # API 客户端层
│   │   │   │   ├── client.ts
│   │   │   │   ├── auth.api.ts
│   │   │   │   ├── chat.api.ts
│   │   │   │   └── user.api.ts
│   │   │   ├── ai/                    # AI 集成层
│   │   │   │   ├── qwen.client.ts
│   │   │   │   ├── stream.handler.ts
│   │   │   │   └── context.manager.ts
│   │   │   ├── state/                 # 状态管理层
│   │   │   │   ├── store.ts
│   │   │   │   ├── chat.store.ts
│   │   │   │   ├── user.store.ts
│   │   │   │   └── session.store.ts
│   │   │   ├── components/            # 通用 UI 组件
│   │   │   │   ├── ui/                # 基础 UI 组件
│   │   │   │   ├── chat/              # 聊天相关组件
│   │   │   │   └── common/            # 通用组件
│   │   │   ├── utils/                 # 工具函数
│   │   │   │   ├── date.utils.ts
│   │   │   │   ├── string.utils.ts
│   │   │   │   └── validation.utils.ts
│   │   │   └── types/                 # 类型定义
│   │   │       ├── api.types.ts
│   │   │       ├── chat.types.ts
│   │   │       └── user.types.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── desktop/                       # Electron 桌面端
│   │   ├── src/
│   │   │   ├── main/                  # 主进程
│   │   │   │   ├── main.ts
│   │   │   │   ├── window.manager.ts
│   │   │   │   └── menu.manager.ts
│   │   │   ├── renderer/              # 渲染进程
│   │   │   │   ├── App.tsx
│   │   │   │   ├── pages/             # 页面组件
│   │   │   │   └── adapters/          # 桌面端适配器
│   │   │   └── preload/               # 预加载脚本
│   │   │       └── preload.ts
│   │   ├── public/
│   │   ├── package.json
│   │   └── electron-builder.json
│   │
│   ├── mobile/                        # React Native 移动端
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── navigation/            # 导航配置
│   │   │   ├── screens/               # 屏幕组件
│   │   │   ├── adapters/              # 移动端适配器
│   │   │   └── native/                # 原生模块
│   │   ├── android/                   # Android 原生代码
│   │   ├── ios/                       # iOS 原生代码
│   │   ├── package.json
│   │   └── metro.config.js
│   │
│   ├── web/                           # React Web 端
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── pages/                 # 页面组件
│   │   │   ├── adapters/              # Web 端适配器
│   │   │   └── public/                # 静态资源
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── backend/                       # 后端服务
│       ├── src/
│       │   ├── app.ts                 # 应用入口
│       │   ├── config/                # 配置文件
│       │   ├── controllers/           # 控制器
│       │   │   ├── auth.controller.ts
│       │   │   ├── chat.controller.ts
│       │   │   ├── user.controller.ts
│       │   │   └── session.controller.ts
│       │   ├── services/              # 业务服务
│       │   │   ├── auth.service.ts
│       │   │   ├── chat.service.ts
│       │   │   ├── user.service.ts
│       │   │   ├── session.service.ts
│       │   │   └── ai.service.ts
│       │   ├── middleware/            # 中间件
│       │   │   ├── auth.middleware.ts
│       │   │   ├── cors.middleware.ts
│       │   │   └── error.middleware.ts
│       │   ├── models/                # 数据模型
│       │   │   ├── user.model.ts
│       │   │   ├── chat.model.ts
│       │   │   ├── session.model.ts
│       │   │   └── message.model.ts
│       │   ├── routes/                # 路由配置
│       │   │   ├── auth.routes.ts
│       │   │   ├── chat.routes.ts
│       │   │   ├── user.routes.ts
│       │   │   └── session.routes.ts
│       │   ├── utils/                 # 工具函数
│       │   │   ├── logger.ts
│       │   │   ├── validator.ts
│       │   │   └── crypto.ts
│       │   └── types/                 # 类型定义
│       │       ├── api.types.ts
│       │       ├── auth.types.ts
│       │       └── chat.types.ts
│       ├── prisma/                    # 数据库配置
│       │   ├── schema.prisma
│       │   └── migrations/
│       ├── package.json
│       └── tsconfig.json
│
├── docs/                              # 项目文档
│   ├── architecture/                  # 架构文档
│   ├── api/                          # API 文档
│   ├── deployment/                   # 部署文档
│   └── development/                  # 开发文档
│
├── scripts/                          # 构建和部署脚本
│   ├── build.sh
│   ├── deploy.sh
│   └── setup.sh
│
├── .github/                          # GitHub 配置
│   └── workflows/                    # CI/CD 配置
│
├── package.json                      # 根包配置
├── pnpm-workspace.yaml              # pnpm 工作空间配置
├── tsconfig.json                    # TypeScript 配置
└── README.md                        # 项目说明
```

## 共享代码层架构设计

### 1. 业务逻辑层 (Business Logic Layer)

```typescript
// packages/shared/src/business/chat/chat.service.ts
export class ChatService {
  constructor(
    private apiClient: ApiClient,
    private aiService: AIService,
    private sessionService: SessionService
  ) {}

  async sendMessage(message: string, sessionId: string): Promise<ChatResponse> {
    // 业务逻辑处理
  }

  async getChatHistory(sessionId: string): Promise<Message[]> {
    // 获取聊天历史
  }
}
```

### 2. 数据模型层 (Data Models Layer)

```typescript
// packages/shared/src/models/chat.model.ts
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  sessionId: string;
}

export interface Session {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
```

### 3. API 客户端层 (API Client Layer)

```typescript
// packages/shared/src/api/client.ts
export class ApiClient {
  private baseURL: string;
  private token?: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    // 统一的 API 请求处理
  }
}
```

### 4. AI 集成层 (AI Integration Layer)

```typescript
// packages/shared/src/ai/qwen.client.ts
export class QwenClient {
  private apiKey: string;
  private baseURL: string;

  async generateResponse(
    messages: Message[],
    options?: QwenOptions
  ): Promise<AsyncIterable<string>> {
    // QWEN API 集成
  }
}
```

### 5. 状态管理层 (State Management Layer)

```typescript
// packages/shared/src/state/chat.store.ts
export class ChatStore {
  private messages: Message[] = [];
  private currentSession: Session | null = null;

  // 状态管理逻辑
}
```

## 平台适配层设计

### 1. 桌面端适配器 (Desktop Adapter)

```typescript
// packages/desktop/src/adapters/desktop.adapter.ts
export class DesktopAdapter {
  // 桌面端特定功能
  openFileDialog(): Promise<string> {
    // Electron 文件对话框
  }

  showNotification(title: string, body: string): void {
    // 系统通知
  }
}
```

### 2. 移动端适配器 (Mobile Adapter)

```typescript
// packages/mobile/src/adapters/mobile.adapter.ts
export class MobileAdapter {
  // 移动端特定功能
  async requestPermissions(): Promise<boolean> {
    // 权限请求
  }

  shareContent(content: string): void {
    // 内容分享
  }
}
```

### 3. Web 端适配器 (Web Adapter)

```typescript
// packages/web/src/adapters/web.adapter.ts
export class WebAdapter {
  // Web 端特定功能
  copyToClipboard(text: string): Promise<void> {
    // 剪贴板操作
  }

  downloadFile(url: string, filename: string): void {
    // 文件下载
  }
}
```

## 后端服务架构设计

### 1. API 网关层 (API Gateway)

```typescript
// packages/backend/src/app.ts
import Koa from "koa";
import Router from "@koa/router";

const app = new Koa();
const router = new Router();

// 中间件配置
app.use(cors());
app.use(bodyParser());
app.use(authMiddleware());

// 路由配置
router.use("/api/auth", authRoutes);
router.use("/api/chat", chatRoutes);
router.use("/api/user", userRoutes);

app.use(router.routes());
```

### 2. 业务服务层 (Business Services)

```typescript
// packages/backend/src/services/chat.service.ts
export class ChatService {
  constructor(
    private aiService: AIService,
    private sessionService: SessionService,
    private messageRepository: MessageRepository
  ) {}

  async processMessage(
    message: string,
    sessionId: string,
    userId: string
  ): Promise<ChatResponse> {
    // 业务逻辑处理
  }
}
```

### 3. AI 服务层 (AI Services)

```typescript
// packages/backend/src/services/ai.service.ts
export class AIService {
  constructor(private qwenClient: QwenClient) {}

  async generateResponse(
    messages: Message[],
    options?: AIOptions
  ): Promise<AsyncIterable<string>> {
    // AI 响应生成
  }
}
```

## 数据层设计

### 1. 数据库设计

```prisma
// packages/backend/prisma/schema.prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sessions  Session[]
  messages  Message[]
}

model Session {
  id        String   @id @default(cuid())
  title     String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User      @relation(fields: [userId], references: [id])
  messages  Message[]
}

model Message {
  id        String   @id @default(cuid())
  content   String
  role      Role
  sessionId String
  userId    String
  createdAt DateTime @default(now())

  session   Session @relation(fields: [sessionId], references: [id])
  user      User    @relation(fields: [userId], references: [id])
}

enum Role {
  USER
  ASSISTANT
}
```

### 2. 缓存层设计

```typescript
// packages/backend/src/services/cache.service.ts
export class CacheService {
  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    // 缓存获取
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    // 缓存设置
  }
}
```

## 部署架构设计

### 1. 开发环境

```yaml
# docker-compose.dev.yml
version: "3.8"
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: chatbot_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  backend:
    build: ./packages/backend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://dev:dev@postgres:5432/chatbot_dev
      REDIS_URL: redis://redis:6379
```

### 2. 生产环境

```yaml
# docker-compose.prod.yml
version: "3.8"
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf

  backend:
    build: ./packages/backend
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

  redis:
    image: redis:7
```

## 安全架构设计

### 1. 认证授权

```typescript
// packages/backend/src/middleware/auth.middleware.ts
export const authMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    ctx.status = 401;
    ctx.body = { error: "Unauthorized" };
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    ctx.state.user = payload;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { error: "Invalid token" };
  }
};
```

### 2. 数据加密

```typescript
// packages/backend/src/utils/crypto.ts
export class CryptoService {
  private static readonly ALGORITHM = "aes-256-gcm";

  static encrypt(text: string, key: string): string {
    // 数据加密
  }

  static decrypt(encryptedText: string, key: string): string {
    // 数据解密
  }
}
```

## 监控和日志设计

### 1. 日志系统

```typescript
// packages/backend/src/utils/logger.ts
import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
```

### 2. 性能监控

```typescript
// packages/backend/src/middleware/metrics.middleware.ts
export const metricsMiddleware = async (ctx: Context, next: Next) => {
  const start = Date.now();

  await next();

  const duration = Date.now() - start;

  // 记录性能指标
  logger.info("Request metrics", {
    method: ctx.method,
    url: ctx.url,
    status: ctx.status,
    duration,
  });
};
```

## 总结

本架构设计基于技术选型文档，实现了：

1. **分层架构**：清晰的客户端层、共享代码层、平台适配层、后端服务层和数据层
2. **代码复用**：80%+ 的代码复用率，通过共享代码包实现
3. **平台适配**：针对不同平台的特定适配器
4. **现代化技术栈**：使用 Koa、Prisma、TypeScript 等现代技术
5. **可扩展性**：模块化设计，支持功能扩展和平台扩展
6. **安全性**：完整的认证授权和数据加密机制
7. **可维护性**：清晰的代码组织和文档结构

这个架构设计为跨平台 AI Chatbot 项目提供了坚实的基础，能够支持项目的长期发展和功能扩展。
