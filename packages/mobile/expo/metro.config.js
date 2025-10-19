const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 修复pnpm workspace的模块解析问题
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// 确保正确的模块解析
config.resolver.nodeModulesPaths = [
  __dirname + '/node_modules',
  __dirname + '/../../node_modules',
];

// 禁用符号链接解析以避免pnpm问题
config.resolver.unstable_enableSymlinks = false;

module.exports = config;
