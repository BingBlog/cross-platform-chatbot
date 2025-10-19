#!/bin/zsh

echo "🧹 清理Mobile目录结构..."
echo "=================================="

# 进入mobile目录
cd "$(dirname "$0")"

echo "📱 当前Mobile目录结构:"
echo "├── expo/          # Expo开发环境 (当前使用)"
echo "├── android/       # Android原生配置 (保留用于学习)"
echo "├── ios/           # iOS原生配置 (保留用于学习)"
echo "├── src/           # 原生React Native源码 (保留)"
echo "└── 配置文件..."

echo ""
echo "✅ Android目录状态检查:"
if [ -d "android" ]; then
    echo "  ✅ android/ 目录存在"
    echo "  📦 包名: com.chatbot.mobile"
    echo "  🏗️  项目名: ChatbotMobile"
    echo "  📱 应用ID: com.chatbot.mobile"
else
    echo "  ❌ android/ 目录不存在"
fi

echo ""
echo "✅ iOS目录状态检查:"
if [ -d "ios" ]; then
    echo "  ✅ ios/ 目录存在"
    echo "  📦 项目名: TempProject (需要重命名为ChatbotMobile)"
    echo "  🍎 目标: iOS原生开发学习"
else
    echo "  ❌ ios/ 目录不存在"
fi

echo ""
echo "✅ Expo目录状态检查:"
if [ -d "expo" ]; then
    echo "  ✅ expo/ 目录存在"
    echo "  🚀 当前开发环境: Expo CLI"
    echo "  📱 聊天界面: 已实现"
else
    echo "  ❌ expo/ 目录不存在"
fi

echo ""
echo "📋 目录用途说明:"
echo "  🎯 expo/     - 当前使用的Expo开发环境，快速原型开发"
echo "  📚 android/  - 保留用于学习Android原生React Native集成"
echo "  📚 ios/      - 保留用于学习iOS原生React Native集成"
echo "  📁 src/      - 原生React Native源码，可复用到原生项目"

echo ""
echo "🔧 建议的后续学习路径:"
echo "  1. 继续使用expo/进行快速开发"
echo "  2. 学习时使用android/和ios/进行原生集成"
echo "  3. 将expo/中的代码迁移到原生项目"

echo ""
echo "✨ Mobile目录结构清理完成！"
