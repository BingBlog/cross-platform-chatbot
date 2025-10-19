#!/bin/bash

# Android Emulator Launch Script for Expo
# This script works around the monkey command issue

echo "🚀 Starting Expo development server..."

# Kill any existing expo processes
pkill -f "expo start" 2>/dev/null || true

# Start the development server in the background
npx expo start &
SERVER_PID=$!

# Wait for the server to start
echo "⏳ Waiting for server to start..."
sleep 8

# Launch Expo Go on Android emulator
echo "📱 Launching Expo Go on Android emulator..."

# Method 1: Try to launch Expo Go directly
adb shell am start -a android.intent.action.MAIN -n host.exp.exponent/.experience.HomeActivity

# Wait a moment
sleep 3

# Method 2: Try to open the project URL
echo "🔗 Opening project URL in Expo Go..."
adb shell am start -a android.intent.action.VIEW -d "exp://192.168.1.39:8081" host.exp.exponent

echo "✅ Done! Your app should now be running on the Android emulator."
echo "📝 If the app doesn't open automatically, scan the QR code in the terminal."
echo "🛑 Press Ctrl+C to stop the development server."

# Wait for user to stop
wait $SERVER_PID
