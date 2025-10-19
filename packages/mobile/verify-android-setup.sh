#!/bin/bash

echo "🔍 验证Android开发环境配置..."
echo "=================================="

# 加载环境变量
source ~/.zshrc

echo "📱 Java版本检查:"
java -version
echo ""

echo "📱 Android SDK路径检查:"
if [ -d "$ANDROID_HOME" ]; then
    echo "✅ ANDROID_HOME: $ANDROID_HOME"
    echo "✅ SDK目录存在"
else
    echo "❌ ANDROID_HOME未设置或SDK目录不存在"
    echo "请确保Android Studio已安装SDK"
fi
echo ""

echo "📱 Android工具检查:"
if command -v adb &> /dev/null; then
    echo "✅ ADB工具可用: $(which adb)"
    adb version
else
    echo "❌ ADB工具不可用"
fi
echo ""

echo "📱 Android模拟器检查:"
if command -v emulator &> /dev/null; then
    echo "✅ 模拟器工具可用: $(which emulator)"
    echo "可用模拟器列表:"
    emulator -list-avds 2>/dev/null || echo "暂无模拟器"
else
    echo "❌ 模拟器工具不可用"
fi
echo ""

echo "📱 React Native环境检查:"
if command -v npx &> /dev/null; then
    echo "✅ npx可用"
    npx react-native doctor
else
    echo "❌ npx不可用"
fi

echo ""
echo "🎯 配置完成后的下一步:"
echo "1. 启动Android模拟器"
echo "2. 运行: npx react-native run-android"
echo "3. 测试应用构建"
