# Mobile Expo Package

这是基于Expo的移动端应用包，完全独立于其他包。

## 特性

- 使用Expo Router进行导航
- 支持iOS、Android和Web平台
- 使用最新的React Native架构
- 完全独立的依赖管理

## 开发

```bash
# 启动开发服务器
pnpm start

# 在Android设备上运行
pnpm android

# 在iOS设备上运行
pnpm ios

# 在Web浏览器中运行
pnpm web
```

## 构建

```bash
# 构建Web版本
pnpm build:web

# 构建Android APK (需要EAS)
pnpm build:android

# 构建iOS IPA (需要EAS)
pnpm build:ios
```

## 独立开发

这个包可以完全独立开发，不依赖其他包：

1. 进入包目录：`cd packages/mobile-expo`
2. 安装依赖：`pnpm install`
3. 启动开发：`pnpm start`

## 项目结构

```
packages/mobile-expo/
├── app/                 # Expo Router页面
├── components/          # 可复用组件
├── constants/           # 常量定义
├── hooks/              # 自定义Hooks
├── assets/             # 静态资源
└── scripts/            # 构建脚本
```