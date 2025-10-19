# Mobile 应用目录

## 📁 目录结构

```
mobile/
├── expo/                    # 🚀 Expo开发环境 (当前使用)
│   ├── App.tsx             # 聊天界面实现
│   ├── package.json        # Expo项目配置
│   ├── app.json           # Expo应用配置
│   └── assets/            # 静态资源
├── android/                # 📱 Android原生配置 (学习用)
│   ├── app/build.gradle   # Android构建配置
│   ├── settings.gradle    # Gradle设置
│   └── src/main/java/     # Java源码
├── ios/                    # 🍎 iOS原生配置 (学习用)
│   ├── Podfile            # CocoaPods配置
│   ├── TempProject/       # Xcode项目
│   └── TempProject.xcodeproj/
├── src/                    # 📦 原生React Native源码
│   ├── App.tsx            # 应用根组件
│   ├── components/        # React Native组件
│   ├── screens/           # 屏幕组件
│   └── services/          # 服务层
└── 配置文件...
```

## 🎯 开发策略

### 当前阶段：Expo开发
- **使用目录**: `expo/`
- **优势**: 快速原型开发，无需原生配置
- **状态**: ✅ 聊天界面已实现

### 学习阶段：原生集成
- **Android**: 使用 `android/` 目录学习原生Android集成
- **iOS**: 使用 `ios/` 目录学习原生iOS集成
- **源码**: 复用 `src/` 目录中的React Native代码

## 🚀 快速开始

### Expo开发 (推荐)
```bash
cd expo
npx expo start
```

### Android原生开发 (学习用)
```bash
# 确保Android环境已配置
npx react-native run-android
```

### iOS原生开发 (学习用)
```bash
# 确保iOS环境已配置
cd ios && pod install
npx react-native run-ios
```

## 📋 配置状态

### Android配置 ✅
- **包名**: `com.chatbot.mobile`
- **应用ID**: `com.chatbot.mobile`
- **项目名**: `ChatbotMobile`
- **状态**: 已配置，可用于学习

### iOS配置 ⚠️
- **项目名**: `TempProject` (需要重命名)
- **Bundle ID**: 需要配置
- **状态**: 基础配置完成，需要完善

### Expo配置 ✅
- **项目名**: `ChatbotMobileExpo`
- **Bundle ID**: `com.chatbot.mobile`
- **状态**: 完全配置，可直接使用

## 🔧 开发工具

### 环境检查
```bash
# 检查Android环境
./verify-android-setup.sh

# 检查Mobile目录结构
./cleanup-mobile-structure.sh
```

### 常用命令
```bash
# Expo开发
cd expo && npx expo start

# 原生Android
npx react-native run-android

# 原生iOS
npx react-native run-ios

# 清理构建
npx react-native clean
```

## 📚 学习路径

1. **快速开发**: 使用Expo进行功能开发
2. **原生学习**: 使用android/和ios/目录学习原生集成
3. **代码迁移**: 将Expo代码迁移到原生项目
4. **生产部署**: 使用原生项目进行生产部署

## 🎨 架构优势

- **快速原型**: Expo提供快速开发环境
- **原生学习**: 保留原生配置用于深度学习
- **代码复用**: src/目录中的代码可在不同环境间复用
- **渐进式**: 从Expo到原生的渐进式学习路径
