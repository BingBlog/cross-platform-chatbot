#!/usr/bin/env node

/**
 * Web 调试辅助脚本
 * 用于快速启动和调试 web 版本的登录页面
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkBackendStatus() {
  return new Promise((resolve) => {
    const http = require('http');
    const req = http.get('http://localhost:3000/health', (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function startWebDebug() {
  log('🚀 启动 Web 调试环境...', 'cyan');
  
  // 检查后端服务
  log('📡 检查后端服务状态...', 'yellow');
  const backendRunning = await checkBackendStatus();
  
  if (!backendRunning) {
    log('❌ 后端服务未运行', 'red');
    log('请先启动后端服务:', 'yellow');
    log('  cd packages/backend', 'blue');
    log('  npm run dev', 'blue');
    log('');
    log('或者运行完整启动脚本:', 'yellow');
    log('  npm run dev:all', 'blue');
    return;
  }
  
  log('✅ 后端服务运行正常', 'green');
  
  // 检查依赖
  log('📦 检查依赖...', 'yellow');
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  
  if (!fs.existsSync(nodeModulesPath)) {
    log('📥 安装依赖...', 'yellow');
    const install = spawn('npm', ['install'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        startExpoWeb();
      } else {
        log('❌ 依赖安装失败', 'red');
      }
    });
  } else {
    startExpoWeb();
  }
}

function startExpoWeb() {
  log('🌐 启动 Expo Web 开发服务器...', 'cyan');
  
  const expo = spawn('npx', ['expo', 'start', '--web'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: true
  });
  
  expo.on('close', (code) => {
    if (code === 0) {
      log('✅ Expo Web 服务器已停止', 'green');
    } else {
      log('❌ Expo Web 服务器异常退出', 'red');
    }
  });
  
  // 处理退出信号
  process.on('SIGINT', () => {
    log('\n🛑 正在停止服务器...', 'yellow');
    expo.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    log('\n🛑 正在停止服务器...', 'yellow');
    expo.kill('SIGTERM');
  });
}

function showDebugInfo() {
  log('🔧 Web 调试信息:', 'bright');
  log('');
  log('📱 访问地址:', 'cyan');
  log('  http://localhost:8081', 'blue');
  log('  http://localhost:19006', 'blue');
  log('');
  log('🛠️ 调试工具:', 'cyan');
  log('  • 浏览器开发者工具: F12', 'blue');
  log('  • React DevTools: 浏览器扩展', 'blue');
  log('  • Network 面板: 监控 API 请求', 'blue');
  log('  • Console 面板: 查看日志和错误', 'blue');
  log('  • Application 面板: 查看本地存储', 'blue');
  log('');
  log('🧪 测试数据:', 'cyan');
  log('  • 邮箱: test@example.com', 'blue');
  log('  • 密码: password123', 'blue');
  log('  • 用户名: testuser', 'blue');
  log('');
  log('📋 调试清单:', 'cyan');
  log('  • 检查 CORS 配置', 'blue');
  log('  • 验证 API 连接', 'blue');
  log('  • 测试表单验证', 'blue');
  log('  • 检查状态管理', 'blue');
  log('  • 验证路由跳转', 'blue');
  log('');
  log('📚 更多信息请查看: WEB_DEBUG_GUIDE.md', 'yellow');
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    log('Web 调试脚本使用说明:', 'bright');
    log('');
    log('用法:', 'cyan');
    log('  node scripts/debug-web.js [选项]', 'blue');
    log('');
    log('选项:', 'cyan');
    log('  --help, -h     显示帮助信息', 'blue');
    log('  --info, -i     显示调试信息', 'blue');
    log('  --check, -c    仅检查后端状态', 'blue');
    log('');
    log('示例:', 'cyan');
    log('  node scripts/debug-web.js', 'blue');
    log('  node scripts/debug-web.js --info', 'blue');
    log('  node scripts/debug-web.js --check', 'blue');
    return;
  }
  
  if (args.includes('--info') || args.includes('-i')) {
    showDebugInfo();
    return;
  }
  
  if (args.includes('--check') || args.includes('-c')) {
    log('📡 检查后端服务状态...', 'yellow');
    const backendRunning = await checkBackendStatus();
    if (backendRunning) {
      log('✅ 后端服务运行正常', 'green');
    } else {
      log('❌ 后端服务未运行', 'red');
    }
    return;
  }
  
  // 默认启动调试环境
  await startWebDebug();
}

// 运行主函数
main().catch(console.error);
