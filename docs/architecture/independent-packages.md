# 完全独立的子包架构

## 概述

本项目采用完全独立的子包架构，每个包都可以独立开发、构建和部署，同时保持在同一个仓库中便于管理。

## 包结构

```
packages/
├── backend/              # 后端服务 (Node.js + Koa)
├── web/                  # Web应用 (React + Vite)
├── desktop/              # 桌面应用 (Electron)
├── mobile-native/        # 原生React Native应用
├── mobile-expo/          # Expo React Native应用
├── shared/               # 共享代码库 (可选)
└── mobile-shared/        # 移动端共享代码 (可选)
```

## 完全独立的设计原则

### 1. 独立的依赖管理

每个包都有自己的 `package.json`，管理自己的依赖：

```json
{
  "name": "@chatbot/mobile-expo",
  "dependencies": {
    "expo": "~54.0.13",
    "react": "19.1.0",
    "react-native": "0.81.4"
  }
}
```

### 2. 独立的构建系统

每个包都有自己的构建脚本和配置：

- **Web**: Vite + TypeScript
- **Desktop**: Electron + TypeScript
- **Mobile Native**: React Native CLI
- **Mobile Expo**: Expo CLI
- **Backend**: Node.js + TypeScript

### 3. 独立的开发环境

每个包都可以独立启动开发服务器：

```bash
# 独立开发各个包
cd packages/web && pnpm dev
cd packages/desktop && pnpm dev
cd packages/mobile-expo && pnpm start
cd packages/backend && pnpm dev
```

### 4. 独立的部署流程

每个包都有自己的部署配置和流程：

- **Web**: 静态文件部署到CDN
- **Desktop**: 打包为可执行文件
- **Mobile**: 构建为APK/IPA
- **Backend**: 部署到服务器

## 包间通信

### 1. API通信

所有包通过REST API与后端通信：

```typescript
// 统一的API客户端
const apiClient = new ApiClient({
  baseURL: 'http://localhost:3001/api'
});
```

### 2. 共享类型定义

通过独立的类型包共享TypeScript类型：

```typescript
// packages/shared-types/src/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
}
```

### 3. 共享工具函数

通过独立的工具包共享通用函数：

```typescript
// packages/shared-utils/src/index.ts
export const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};
```

## 开发工作流

### 1. 独立开发

```bash
# 选择要开发的包
cd packages/mobile-expo

# 安装依赖
pnpm install

# 启动开发
pnpm start
```

### 2. 跨包开发

```bash
# 从根目录启动多个包
pnpm dev:web          # 启动Web应用
pnpm dev:mobile-expo  # 启动Expo应用
pnpm dev:backend      # 启动后端服务
```

### 3. 构建和测试

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm build:web
pnpm build:mobile-expo

# 测试所有包
pnpm test

# 测试特定包
pnpm test:mobile-expo
```

## 优势

### 1. 完全独立

- 每个包可以独立开发、测试、部署
- 不依赖其他包的内部实现
- 可以独立升级技术栈

### 2. 团队协作

- 不同团队可以独立开发不同包
- 减少代码冲突和依赖问题
- 便于代码审查和维护

### 3. 技术多样性

- 每个包可以使用最适合的技术栈
- 可以独立实验新技术
- 降低技术债务风险

### 4. 部署灵活性

- 可以独立部署和回滚
- 支持不同的部署策略
- 便于监控和故障排查

## 最佳实践

### 1. 包命名规范

```json
{
  "name": "@chatbot/package-name"
}
```

### 2. 版本管理

每个包独立管理版本，使用语义化版本控制。

### 3. 文档维护

每个包都应该有自己的README和API文档。

### 4. 测试策略

每个包都应该有完整的测试覆盖。

### 5. CI/CD配置

为每个包配置独立的CI/CD流水线。

## 迁移指南

如果你想要将现有项目迁移到这种架构：

1. **分析依赖关系**: 识别包间的依赖关系
2. **提取共享代码**: 将共享代码提取到独立包
3. **重构API**: 确保包间通过API通信
4. **更新构建配置**: 为每个包配置独立的构建流程
5. **测试验证**: 确保所有包都能独立运行

这种架构特别适合：
- 跨平台应用开发
- 微服务架构
- 多团队协作项目
- 需要独立部署的应用
