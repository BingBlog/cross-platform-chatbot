#!/usr/bin/env node

/**
 * 认证功能测试脚本
 * 用于验证API连接和基本功能
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testAuthAPI() {
  console.log('🧪 开始测试认证API...\n');

  try {
    // 测试健康检查
    console.log('1. 测试后端健康检查...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ 后端服务正常运行');
    console.log(`   状态: ${healthResponse.data.status}`);
    console.log(`   数据库: ${healthResponse.data.database}\n`);

    // 测试注册
    console.log('2. 测试用户注册...');
    const testUser = {
      email: `test-${Date.now()}@example.com`,
      username: `testuser${Date.now()}`,
      password: 'password123',
      confirmPassword: 'password123'
    };

    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
      console.log('✅ 用户注册成功');
      console.log(`   用户ID: ${registerResponse.data.data.user.id}`);
      console.log(`   用户名: ${registerResponse.data.data.user.username}`);
      console.log(`   邮箱: ${registerResponse.data.data.user.email}\n`);

      // 测试登录
      console.log('3. 测试用户登录...');
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ 用户登录成功');
      console.log(`   访问令牌: ${loginResponse.data.data.accessToken.substring(0, 20)}...`);
      console.log(`   刷新令牌: ${loginResponse.data.data.refreshToken.substring(0, 20)}...\n`);

      // 测试登出
      console.log('4. 测试用户登出...');
      const logoutResponse = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${loginResponse.data.data.accessToken}`
        }
      });
      console.log('✅ 用户登出成功\n');

      console.log('🎉 所有认证功能测试通过！');
      console.log('\n📱 现在可以启动移动应用进行测试：');
      console.log('   cd packages/mobile-expo');
      console.log('   npm start');

    } catch (error) {
      if (error.response) {
        console.log('❌ API请求失败:');
        console.log(`   状态码: ${error.response.status}`);
        console.log(`   错误信息: ${error.response.data.message || error.response.data.error}`);
      } else {
        console.log('❌ 网络错误:', error.message);
      }
    }

  } catch (error) {
    console.log('❌ 后端服务连接失败');
    console.log('   请确保后端服务正在运行:');
    console.log('   cd packages/backend');
    console.log('   npm run dev');
    console.log('\n   错误详情:', error.message);
  }
}

// 运行测试
testAuthAPI().catch(console.error);
