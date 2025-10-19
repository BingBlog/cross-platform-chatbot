# 跨平台 AI Chatbot 项目

基于大模型的智能聊天机器人，支持多平台部署，提供完整的对话体验和会话管理功能。

## 项目目的

学习跨平台开发技术，掌握不同平台的应用开发方法和最佳实践。

## 文档结构

### 📋 [需求文档](docs/requirement.md)

项目需求文档索引，包含完整的项目概述和文档结构说明。

### 📋 [学习计划](docs/learning-plan.md)

完整的学习路径规划，包含 4 个阶段的学习重点和进度跟踪。

### 🎯 [P0 - 核心学习目标](docs/requirements/p0-core-requirements.md)

桌面应用和移动端 Android 开发的核心功能，重点关注：

- 聊天功能（基础对话、消息类型）
- 会话管理功能
- 用户认证与权限
- 个性化设置
- 性能与体验
- 跨平台支持（Windows、macOS、Android）

### 🔧 [P1 - 重要学习内容](docs/requirements/p1-important-requirements.md)

桌面和移动端开发的关键技术：

- 权限控制
- AI 模型设置
- 智能功能
- iOS 应用开发

### 🚀 [P2 - 进阶学习内容](docs/requirements/p2-advanced-requirements.md)

跨平台开发的高级特性：

- 高级交互功能
- 协作功能和社交特性
- 性能优化和安全机制
- 监控和分析功能

## 学习重点

- **桌面应用特性**：系统集成、快捷键、拖拽等
- **移动应用特性**：手势、触摸、传感器等
- **平台差异**：不同平台的交互模式和设计规范
- **代码复用**：桌面和移动端之间的代码复用策略
- **性能优化**：各平台的性能优化技巧

## 项目结构

```
cross-platform-chatbot/
├── README.md                    # 项目说明
├── docs/                        # 文档目录
│   ├── requirement.md           # 需求文档索引
│   ├── learning-plan.md         # 学习计划
│   ├── architecture/            # 架构文档
│   │   └── independent-packages.md # 独立包架构说明
│   └── requirements/            # 需求文档目录
│       ├── p0-core-requirements.md  # P0核心学习目标
│       ├── p1-important-requirements.md # P1重要学习内容
│       └── p2-advanced-requirements.md  # P2进阶学习内容
├── packages/                    # 完全独立的子包目录
│   ├── backend/                 # 后端服务 (Node.js + Koa) - 完全独立
│   ├── web/                     # React Web应用 - 完全独立
│   ├── desktop/                 # Electron桌面应用 - 完全独立
│   ├── shared/                  # 跨平台通用共享库 (可选)
│   ├── mobile-expo/             # Expo移动应用 (React Native 0.81.4) - 完全独立
│   ├── mobile-native/           # 原生移动应用 (React Native 0.72.7) - 完全独立
│   └── mobile-shared/           # 移动端专用共享库 (可选)
├── scripts/                     # 管理脚本
│   └── manage-packages.sh       # 独立包管理脚本
└── pnpm-workspace.yaml          # pnpm工作空间配置
```

## 🎯 完全独立的包架构

本项目采用**完全独立的子包架构**，每个包都可以独立开发、构建和部署：

### 独立包特性

- ✅ **独立依赖管理**: 每个包有自己的 `package.json` 和 `node_modules`
- ✅ **独立构建系统**: 每个包有自己的构建配置和输出
- ✅ **独立开发环境**: 每个包可以独立启动开发服务器
- ✅ **独立部署流程**: 每个包可以独立部署和回滚
- ✅ **独立版本管理**: 每个包独立管理版本号

### 包管理工具

使用 `scripts/manage-packages.sh` 脚本管理所有包：

```bash
# 查看所有包
./scripts/manage-packages.sh list

# 安装特定包依赖
./scripts/manage-packages.sh install mobile-expo

# 启动特定包开发服务器
./scripts/manage-packages.sh dev web

# 构建所有包
./scripts/manage-packages.sh build-all

# 查看包状态
./scripts/manage-packages.sh status
```

### 独立开发工作流

```bash
# 方式1: 使用管理脚本
./scripts/manage-packages.sh dev mobile-expo

# 方式2: 直接进入包目录
cd packages/mobile-expo
pnpm install
pnpm start

# 方式3: 从根目录使用pnpm filter
pnpm --filter @chatbot/mobile-expo start
```

## 开始学习

1. 首先阅读 [需求文档](docs/requirement.md) 了解项目概述
2. 查看 [学习计划](docs/learning-plan.md) 制定学习路径
3. 从 [P0 核心学习目标](docs/requirements/p0-core-requirements.md) 开始实现
4. 逐步扩展到 [P1](docs/requirements/p1-important-requirements.md) 和 [P2](docs/requirements/p2-advanced-requirements.md) 功能

## 技术栈

- **后端服务**：Node.js + Koa.js + TypeScript
- **数据库**：PostgreSQL + Redis + Prisma ORM
- **Web应用**：React 18 + TypeScript + Tailwind CSS
- **桌面应用**：Electron + React
- **移动应用**：
  - **Expo开发**：React Native 0.81.4 + Expo SDK 54
  - **原生开发**：React Native 0.72.7 + Android/iOS原生集成
- **AI模型**：QWEN API集成
- **状态管理**：Zustand + React Query
- **构建工具**：pnpm workspace + TypeScript

## 共享库架构

### 🎯 `@chatbot/shared` - 跨平台通用共享库

**定位**：跨平台通用代码，支持Web、Desktop、Mobile的80%+代码复用

**特点**：
- ✅ **跨平台兼容**：使用Web标准API（DOM、CSS类名）
- ✅ **完整架构**：包含完整的业务逻辑、状态管理、API客户端
- ✅ **构建输出**：编译为`dist/`目录，可被其他平台引用
- ✅ **丰富功能**：AI集成、用户管理、会话管理、完整UI组件库

**内容结构**：
```
@chatbot/shared/
├── business/          # 业务逻辑层
├── models/           # 数据模型
├── api/              # API客户端
├── ai/               # AI集成服务
├── state/            # 状态管理 (Zustand)
├── components/       # UI组件 (Web标准)
├── adapters/         # 平台适配器
├── utils/            # 工具函数
└── types/            # TypeScript类型
```

**使用场景**：
- Web应用 (`packages/web/`)
- Desktop应用 (`packages/desktop/`)
- 作为基础库被其他平台引用

### 📱 `@chatbot/mobile-shared` - 移动端专用共享库

**定位**：移动端专用代码，专门为React Native环境设计

**特点**：
- ✅ **React Native专用**：使用React Native组件（View、Text、StyleSheet）
- ✅ **轻量级**：只包含移动端必需的组件和工具
- ✅ **直接引用**：TypeScript源码直接引用，无需构建
- ✅ **移动优化**：针对移动端交互和性能优化

**内容结构**：
```
@chatbot/mobile-shared/
├── components/       # React Native组件
├── hooks/           # React Native Hooks
├── types/           # 移动端类型定义
└── utils/           # 移动端工具函数
```

**使用场景**：
- Expo应用 (`packages/mobile-expo/`)
- 原生应用 (`packages/mobile-native/`)

### 🔄 共享库关系

| 特性 | `@chatbot/shared` | `@chatbot/mobile-shared` |
|------|-------------------|--------------------------|
| **平台** | 跨平台 (Web/Desktop/Mobile) | 移动端专用 |
| **组件** | `<div>`, `<span>`, CSS类名 | `<View>`, `<Text>`, StyleSheet |
| **构建** | 编译为dist/ | 直接TypeScript源码 |
| **依赖** | React + React-DOM | React + React-Native |
| **复杂度** | 完整业务逻辑 | 轻量级组件库 |

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev:web          # 启动Web应用
pnpm dev:desktop      # 启动桌面应用
pnpm dev:mobile-expo  # 启动Expo移动应用
pnpm dev:mobile-native # 启动原生移动应用
pnpm dev:backend      # 启动后端服务

# 构建
pnpm build:web        # 构建Web应用
pnpm build:desktop    # 构建桌面应用
pnpm build:mobile-expo # 构建Expo应用
pnpm build:mobile-native # 构建原生应用
pnpm build:backend    # 构建后端服务

# 测试
pnpm test            # 运行所有测试
pnpm lint            # 代码检查
pnpm type-check      # 类型检查
```
