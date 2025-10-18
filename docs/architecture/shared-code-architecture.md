# 共享代码层架构设计

## 概述

共享代码层是整个跨平台 AI Chatbot 项目的核心，负责实现 80%+ 的代码复用。本层采用分层架构设计，包含业务逻辑层、数据模型层、API 客户端层、AI 集成层、状态管理层和 UI 组件层。

## 整体架构图

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            共享代码层 (Shared Code Layer)                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   业务逻辑层     │  │   数据模型层     │  │   API 客户端层   │                  │
│  │                 │  │                 │  │                 │                  │
│  │ • 聊天服务      │  │ • 用户模型      │  │ • HTTP 客户端   │                  │
│  │ • 会话管理      │  │ • 消息模型      │  │ • WebSocket     │                  │
│  │ • 用户管理      │  │ • 会话模型      │  │ • 错误处理      │                  │
│  │ • AI 集成       │  │ • 配置模型      │  │ • 请求拦截器    │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   AI 集成层     │  │   状态管理层     │  │   UI 组件库     │                  │
│  │                 │  │                 │  │                 │                  │
│  │ • QWEN 客户端   │  │ • 全局状态      │  │ • 基础组件      │                  │
│  │ • 流式响应      │  │ • 聊天状态      │  │ • 聊天组件      │                  │
│  │ • 上下文管理    │  │ • 用户状态      │  │ • 表单组件      │                  │
│  │ • 模型配置      │  │ • 会话状态      │  │ • 布局组件      │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 目录结构设计

```
packages/shared/
├── src/
│   ├── business/                      # 业务逻辑层
│   │   ├── chat/                      # 聊天业务逻辑
│   │   │   ├── chat.service.ts        # 聊天服务
│   │   │   ├── message.processor.ts   # 消息处理器
│   │   │   └── conversation.manager.ts # 对话管理器
│   │   ├── user/                      # 用户业务逻辑
│   │   │   ├── user.service.ts        # 用户服务
│   │   │   ├── auth.service.ts        # 认证服务
│   │   │   └── profile.service.ts     # 用户资料服务
│   │   ├── session/                   # 会话管理逻辑
│   │   │   ├── session.service.ts     # 会话服务
│   │   │   ├── session.manager.ts     # 会话管理器
│   │   │   └── session.storage.ts     # 会话存储
│   │   └── ai/                        # AI 集成逻辑
│   │       ├── ai.service.ts          # AI 服务
│   │       ├── context.manager.ts     # 上下文管理器
│   │       └── prompt.engine.ts       # 提示词引擎
│   │
│   ├── models/                        # 数据模型层
│   │   ├── user.model.ts              # 用户模型
│   │   ├── chat.model.ts              # 聊天模型
│   │   ├── session.model.ts           # 会话模型
│   │   ├── message.model.ts           # 消息模型
│   │   ├── ai.model.ts                # AI 模型
│   │   └── config.model.ts            # 配置模型
│   │
│   ├── api/                           # API 客户端层
│   │   ├── client.ts                  # 基础客户端
│   │   ├── auth.api.ts                # 认证 API
│   │   ├── chat.api.ts                # 聊天 API
│   │   ├── user.api.ts                # 用户 API
│   │   ├── session.api.ts             # 会话 API
│   │   ├── websocket.client.ts        # WebSocket 客户端
│   │   └── interceptors/              # 请求拦截器
│   │       ├── auth.interceptor.ts    # 认证拦截器
│   │       ├── error.interceptor.ts   # 错误拦截器
│   │       └── retry.interceptor.ts   # 重试拦截器
│   │
│   ├── ai/                            # AI 集成层
│   │   ├── qwen.client.ts             # QWEN 客户端
│   │   ├── stream.handler.ts          # 流式响应处理器
│   │   ├── context.manager.ts         # 上下文管理器
│   │   ├── prompt.templates.ts        # 提示词模板
│   │   └── model.config.ts            # 模型配置
│   │
│   ├── state/                         # 状态管理层
│   │   ├── store.ts                   # 主状态存储
│   │   ├── chat.store.ts              # 聊天状态
│   │   ├── user.store.ts              # 用户状态
│   │   ├── session.store.ts           # 会话状态
│   │   ├── ai.store.ts                # AI 状态
│   │   └── middleware/                # 状态中间件
│   │       ├── persistence.middleware.ts # 持久化中间件
│   │       └── devtools.middleware.ts    # 开发工具中间件
│   │
│   ├── components/                    # UI 组件库
│   │   ├── ui/                        # 基础 UI 组件
│   │   │   ├── button/                # 按钮组件
│   │   │   ├── input/                 # 输入组件
│   │   │   ├── modal/                 # 模态框组件
│   │   │   ├── toast/                 # 提示组件
│   │   │   └── loading/               # 加载组件
│   │   ├── chat/                      # 聊天相关组件
│   │   │   ├── message.bubble/        # 消息气泡
│   │   │   ├── message.input/         # 消息输入
│   │   │   ├── message.list/          # 消息列表
│   │   │   └── typing.indicator/      # 输入指示器
│   │   ├── common/                    # 通用组件
│   │   │   ├── header/                # 头部组件
│   │   │   ├── sidebar/               # 侧边栏组件
│   │   │   ├── navigation/            # 导航组件
│   │   │   └── layout/                # 布局组件
│   │   └── forms/                     # 表单组件
│   │       ├── login.form/            # 登录表单
│   │       ├── register.form/         # 注册表单
│   │       └── settings.form/         # 设置表单
│   │
│   ├── utils/                         # 工具函数
│   │   ├── date.utils.ts              # 日期工具
│   │   ├── string.utils.ts            # 字符串工具
│   │   ├── validation.utils.ts        # 验证工具
│   │   ├── crypto.utils.ts            # 加密工具
│   │   ├── storage.utils.ts           # 存储工具
│   │   └── platform.utils.ts         # 平台工具
│   │
│   ├── types/                         # 类型定义
│   │   ├── api.types.ts               # API 类型
│   │   ├── chat.types.ts              # 聊天类型
│   │   ├── user.types.ts              # 用户类型
│   │   ├── session.types.ts           # 会话类型
│   │   ├── ai.types.ts                # AI 类型
│   │   └── common.types.ts            # 通用类型
│   │
│   └── constants/                     # 常量定义
│       ├── api.constants.ts           # API 常量
│       ├── chat.constants.ts          # 聊天常量
│       ├── user.constants.ts          # 用户常量
│       └── ai.constants.ts            # AI 常量
│
├── package.json                       # 包配置
├── tsconfig.json                      # TypeScript 配置
├── vite.config.ts                     # Vite 配置
└── README.md                          # 包说明
```

## 层间依赖关系

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              层间依赖关系图                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │   UI 组件层  │    │   状态管理层  │    │  业务逻辑层  │    │  数据模型层  │      │
│  │             │    │             │    │             │    │             │      │
│  │ • 组件渲染  │    │ • 状态管理  │    │ • 业务逻辑  │    │ • 数据定义  │      │
│  │ • 用户交互  │    │ • 数据同步  │    │ • 服务调用  │    │ • 类型约束  │      │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘      │
│         │                   │                   │                   │          │
│         └───────────────────┼───────────────────┼───────────────────┘          │
│                             │                   │                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                        │
│  │  API 客户端层 │    │   AI 集成层  │    │   工具函数层  │                        │
│  │             │    │             │    │             │                        │
│  │ • HTTP 请求 │    │ • AI 调用   │    │ • 通用工具  │                        │
│  │ • WebSocket │    │ • 流式响应  │    │ • 验证函数  │                        │
│  │ • 错误处理  │    │ • 上下文管理│    │ • 格式化   │                        │
│  └─────────────┘    └─────────────┘    └─────────────┘                        │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 核心设计原则

### 1. 单一职责原则

每个模块只负责一个特定的功能，确保代码的清晰性和可维护性。

### 2. 依赖倒置原则

高层模块不依赖低层模块，都依赖于抽象接口。

### 3. 开闭原则

对扩展开放，对修改关闭，支持功能扩展而不影响现有代码。

### 4. 接口隔离原则

使用多个专门的接口，而不是单一的总接口。

### 5. 代码复用原则

最大化代码复用，减少重复代码。

## 模块间通信机制

### 1. 事件驱动通信

```typescript
// 事件总线
export class EventBus {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function): void {
    // 事件监听
  }

  emit(event: string, data?: any): void {
    // 事件触发
  }
}
```

### 2. 状态管理通信

```typescript
// 状态管理
export class StateManager {
  private state: any = {};
  private subscribers: Function[] = [];

  setState(newState: any): void {
    // 状态更新
  }

  subscribe(callback: Function): void {
    // 状态订阅
  }
}
```

### 3. 服务注入通信

```typescript
// 依赖注入
export class ServiceContainer {
  private services: Map<string, any> = new Map();

  register<T>(name: string, service: T): void {
    // 服务注册
  }

  get<T>(name: string): T {
    // 服务获取
  }
}
```

## 平台适配接口

### 1. 平台检测接口

```typescript
export interface PlatformAdapter {
  platform: "desktop" | "mobile" | "web";
  capabilities: PlatformCapabilities;

  // 平台特定功能
  openFileDialog(): Promise<string>;
  showNotification(title: string, body: string): void;
  shareContent(content: string): void;
}
```

### 2. 存储适配接口

```typescript
export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

### 3. 网络适配接口

```typescript
export interface NetworkAdapter {
  request<T>(config: RequestConfig): Promise<T>;
  upload(file: File, progress?: (progress: number) => void): Promise<string>;
  download(url: string): Promise<Blob>;
}
```

## 错误处理机制

### 1. 统一错误类型

```typescript
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
  }
}
```

### 2. 错误处理中间件

```typescript
export class ErrorHandler {
  static handle(error: Error): void {
    // 错误处理逻辑
  }

  static report(error: Error): void {
    // 错误上报
  }
}
```

## 配置管理

### 1. 环境配置

```typescript
export interface AppConfig {
  api: {
    baseURL: string;
    timeout: number;
  };
  ai: {
    qwenApiKey: string;
    model: string;
  };
  storage: {
    type: "local" | "cloud";
    bucket?: string;
  };
}
```

### 2. 配置加载器

```typescript
export class ConfigLoader {
  static load(): AppConfig {
    // 配置加载逻辑
  }

  static validate(config: AppConfig): boolean {
    // 配置验证
  }
}
```

## 性能优化策略

### 1. 代码分割

- 按功能模块分割代码
- 懒加载非关键模块
- 动态导入大型依赖

### 2. 缓存策略

- 内存缓存频繁访问的数据
- 本地存储用户配置
- 智能缓存失效机制

### 3. 资源优化

- 图片压缩和懒加载
- 字体优化和预加载
- 代码压缩和混淆

## 测试策略

### 1. 单元测试

- 业务逻辑层测试
- 工具函数测试
- 组件测试

### 2. 集成测试

- API 集成测试
- 状态管理测试
- 组件集成测试

### 3. 端到端测试

- 用户流程测试
- 跨平台兼容性测试
- 性能测试

## 总结

共享代码层架构设计实现了：

1. **分层架构**: 清晰的六层架构，职责分明
2. **模块化设计**: 高度模块化，便于维护和扩展
3. **平台无关**: 通过适配器模式实现平台无关性
4. **类型安全**: 全面的 TypeScript 类型定义
5. **错误处理**: 统一的错误处理机制
6. **性能优化**: 多层次的性能优化策略
7. **测试覆盖**: 完整的测试策略

这个架构为跨平台 AI Chatbot 项目提供了坚实的共享代码基础，能够实现 80%+ 的代码复用率。
