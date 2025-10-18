# 项目结构概览

## 📁 完整目录结构

```
cross-platform-chatbot/
├── 📄 package.json                    # 根包配置，workspace 管理
├── 📄 tsconfig.json                   # 根 TypeScript 配置
├── 📄 .gitignore                      # Git 忽略文件
├── 📄 env.example                     # 环境变量模板
├── 📄 PROJECT_STRUCTURE.md            # 项目结构说明
├── 📄 .cursorrules                    # Cursor Rules 配置
├── 📄 README.md                       # 项目说明
│
├── 📁 docs/                           # 文档目录
│   ├── 📁 architecture/               # 架构文档
│   ├── 📁 cursor-rules/               # Cursor Rules 详细文档
│   ├── 📁 requirements/               # 需求文档
│   ├── 📁 tech-stack/                 # 技术栈选择文档
│   └── 📄 ...                         # 其他文档
│
└── 📁 packages/                       # 包目录
    ├── 📁 shared/                     # 共享代码包 (80%+ 复用)
    │   ├── 📄 package.json            # 共享包配置
    │   ├── 📄 tsconfig.json           # TypeScript 配置
    │   └── 📁 src/                    # 源代码
    │       ├── 📄 index.ts            # 入口文件
    │       ├── 📁 business/           # 业务逻辑
    │       ├── 📁 models/             # 数据模型
    │       ├── 📁 api/                # API 客户端
    │       ├── 📁 ai/                 # AI 集成
    │       ├── 📁 state/              # 状态管理
    │       ├── 📁 components/         # UI 组件
    │       │   ├── 📁 atoms/          # 原子组件
    │       │   ├── 📁 molecules/      # 分子组件
    │       │   ├── 📁 organisms/      # 有机体组件
    │       │   └── 📁 templates/      # 模板组件
    │       ├── 📁 utils/              # 工具函数
    │       ├── 📁 adapters/           # 平台适配器
    │       └── 📁 types/              # 类型定义
    │
    ├── 📁 desktop/                    # 桌面应用 (Electron)
    │   ├── 📄 package.json            # 桌面应用配置
    │   ├── 📄 tsconfig.json           # 主进程 TypeScript 配置
    │   ├── 📄 tsconfig.main.json      # 渲染进程 TypeScript 配置
    │   └── 📁 src/                    # 源代码
    │       ├── 📁 main/               # 主进程
    │       │   ├── 📄 main.ts         # 主进程入口
    │       │   └── 📄 preload.ts      # 预加载脚本
    │       └── 📁 renderer/           # 渲染进程
    │           ├── 📁 components/     # React 组件
    │           ├── 📁 pages/          # 页面组件
    │           ├── 📁 hooks/          # React Hooks
    │           └── 📁 utils/          # 工具函数
    │
    ├── 📁 mobile/                     # 移动应用 (React Native)
    │   ├── 📄 package.json            # 移动应用配置
    │   ├── 📄 tsconfig.json           # TypeScript 配置
    │   ├── 📄 babel.config.js         # Babel 配置
    │   ├── 📄 metro.config.js         # Metro 配置
    │   ├── 📄 app.json                # 应用配置
    │   ├── 📄 index.js                # 应用入口
    │   └── 📁 src/                    # 源代码
    │       ├── 📄 App.tsx             # 应用根组件
    │       ├── 📁 components/         # React Native 组件
    │       ├── 📁 screens/            # 屏幕组件
    │       ├── 📁 navigation/         # 导航配置
    │       ├── 📁 hooks/              # React Hooks
    │       ├── 📁 utils/              # 工具函数
    │       └── 📁 services/           # 服务层
    │
    ├── 📁 web/                        # Web 应用 (React)
    │   ├── 📄 package.json            # Web 应用配置
    │   ├── 📄 tsconfig.json           # TypeScript 配置
    │   ├── 📄 vite.config.ts          # Vite 配置
    │   ├── 📄 tailwind.config.js      # Tailwind CSS 配置
    │   ├── 📄 postcss.config.js       # PostCSS 配置
    │   ├── 📄 index.html              # HTML 模板
    │   └── 📁 src/                    # 源代码
    │       ├── 📄 main.tsx            # 应用入口
    │       ├── 📄 App.tsx             # 应用根组件
    │       ├── 📄 index.css           # 全局样式
    │       ├── 📁 components/         # React 组件
    │       ├── 📁 pages/              # 页面组件
    │       ├── 📁 hooks/              # React Hooks
    │       ├── 📁 utils/              # 工具函数
    │       ├── 📁 services/           # 服务层
    │       └── 📁 assets/             # 静态资源
    │
    └── 📁 backend/                    # 后端服务 (Node.js + Koa)
        ├── 📄 package.json            # 后端服务配置
        ├── 📄 tsconfig.json           # TypeScript 配置
        └── 📁 src/                    # 源代码
        │   ├── 📄 index.ts            # 服务入口
        │   ├── 📁 controllers/        # 控制器
        │   ├── 📁 services/           # 服务层
        │   ├── 📁 middleware/         # 中间件
        │   ├── 📁 utils/              # 工具函数
        │   └── 📁 types/              # 类型定义
        └── 📁 prisma/                 # 数据库配置
            └── 📄 schema.prisma       # Prisma 数据模型
```

## 🎯 核心特性

### ✅ 已完成的基础架构

1. **Monorepo 工作空间配置**
   - 使用 pnpm workspaces 管理多包项目
   - 统一的依赖管理和脚本命令
   - 包之间的依赖关系配置

2. **TypeScript 配置**
   - 根配置和包特定配置
   - 路径别名配置
   - 项目引用 (Project References) 配置

3. **跨平台包结构**
   - **shared**: 80%+ 代码复用的共享包
   - **desktop**: Electron 桌面应用
   - **mobile**: React Native 移动应用
   - **web**: React Web 应用
   - **backend**: Node.js + Koa 后端服务

4. **开发工具配置**
   - Vite (Web 应用构建工具)
   - Metro (React Native 构建工具)
   - Electron Builder (桌面应用打包)
   - Prisma (数据库 ORM)

5. **环境配置**
   - 环境变量模板
   - Git 忽略文件
   - 构建配置文件

## 🚀 下一步计划

### 即将开始的功能开发

1. **开发工具链配置** (P0)
   - ESLint 配置
   - Prettier 配置
   - Husky 预提交钩子
   - 测试框架配置

2. **数据库和AI服务配置** (P0)
   - Prisma 数据库迁移
   - QWEN API 集成
   - Redis 缓存配置

3. **P0 核心功能开发**
   - 用户认证系统
   - 聊天功能实现
   - 会话管理
   - 基础 UI 组件

## 📋 开发命令

```bash
# 安装依赖
pnpm install

# 开发模式 (所有服务)
pnpm dev

# 单独启动服务
pnpm dev:web        # Web 应用
pnpm dev:desktop    # 桌面应用
pnpm dev:mobile     # 移动应用
pnpm dev:backend    # 后端服务

# 构建所有包
pnpm build

# 类型检查
pnpm type-check

# 测试
pnpm test
```

## 🎨 架构优势

1. **高代码复用**: 80%+ 代码在 shared 包中共享
2. **类型安全**: 全项目 TypeScript 支持
3. **开发效率**: 统一的开发工具链和脚本
4. **可维护性**: 清晰的包结构和依赖关系
5. **可扩展性**: 模块化设计，易于添加新功能

项目基础架构已完全搭建完成，可以开始进行具体的功能开发了！
