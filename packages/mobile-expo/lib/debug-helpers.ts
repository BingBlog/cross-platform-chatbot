/**
 * Web 调试助手
 * 在浏览器控制台中提供调试功能
 */

// 调试工具类型定义
interface DebugHelpers {
  // 认证相关
  testLogin: (email?: string, password?: string) => Promise<void>;
  testRegister: (email?: string, username?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
  
  // 状态检查
  getAuthState: () => any;
  getStoredData: () => any;
  
  // API 测试
  testAPI: () => Promise<void>;
  testHealth: () => Promise<void>;
  
  // 路由测试
  goToAuth: () => void;
  goToHome: () => void;
  
  // 表单测试
  fillLoginForm: (email?: string, password?: string) => void;
  fillRegisterForm: (email?: string, username?: string, password?: string) => void;
  
  // 网络监控
  enableNetworkLogging: () => void;
  disableNetworkLogging: () => void;
}

// 测试数据
const TEST_DATA = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'password123',
};

// 创建调试助手
const createDebugHelpers = (): DebugHelpers => {
  return {
    // 测试登录
    async testLogin(email = TEST_DATA.email, password = TEST_DATA.password) {
      console.log('🧪 测试登录:', { email });
      try {
        const { useAuthStore } = await import('./auth-store');
        const { login } = useAuthStore.getState();
        await login(email, password);
        console.log('✅ 登录成功');
      } catch (error) {
        console.error('❌ 登录失败:', error);
      }
    },

    // 测试注册
    async testRegister(
      email = TEST_DATA.email,
      username = TEST_DATA.username,
      password = TEST_DATA.password
    ) {
      console.log('🧪 测试注册:', { email, username });
      try {
        const { useAuthStore } = await import('./auth-store');
        const { register } = useAuthStore.getState();
        await register(email, username, password, password);
        console.log('✅ 注册成功');
      } catch (error) {
        console.error('❌ 注册失败:', error);
      }
    },

    // 登出
    async logout() {
      console.log('🚪 登出');
      try {
        const { useAuthStore } = await import('./auth-store');
        const { logout } = useAuthStore.getState();
        await logout();
        console.log('✅ 登出成功');
      } catch (error) {
        console.error('❌ 登出失败:', error);
      }
    },

    // 清除认证数据
    clearAuth() {
      console.log('🧹 清除认证数据');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('auth-storage');
      console.log('✅ 认证数据已清除');
    },

    // 获取认证状态
    getAuthState() {
      const { useAuthStore } = require('./auth-store');
      const state = useAuthStore.getState();
      console.log('🔍 认证状态:', state);
      return state;
    },

    // 获取存储数据
    getStoredData() {
      const data = {
        auth_token: localStorage.getItem('auth_token'),
        user_info: localStorage.getItem('user_info'),
        auth_storage: localStorage.getItem('auth-storage'),
      };
      console.log('💾 存储数据:', data);
      return data;
    },

    // 测试 API 连接
    async testAPI() {
      console.log('🌐 测试 API 连接');
      try {
        const { authAPI } = await import('./api');
        const response = await fetch('http://localhost:3000/health');
        const data = await response.json();
        console.log('✅ API 连接正常:', data);
      } catch (error) {
        console.error('❌ API 连接失败:', error);
      }
    },

    // 测试健康检查
    async testHealth() {
      console.log('🏥 测试健康检查');
      try {
        const response = await fetch('http://localhost:3000/health');
        const data = await response.json();
        console.log('✅ 健康检查通过:', data);
      } catch (error) {
        console.error('❌ 健康检查失败:', error);
      }
    },

    // 跳转到认证页面
    goToAuth() {
      console.log('🔐 跳转到认证页面');
      window.location.href = '/auth';
    },

    // 跳转到主页
    goToHome() {
      console.log('🏠 跳转到主页');
      window.location.href = '/';
    },

    // 填充登录表单
    fillLoginForm(email = TEST_DATA.email, password = TEST_DATA.password) {
      console.log('📝 填充登录表单');
      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      
      if (emailInput) {
        emailInput.value = email;
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      if (passwordInput) {
        passwordInput.value = password;
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      console.log('✅ 登录表单已填充');
    },

    // 填充注册表单
    fillRegisterForm(
      email = TEST_DATA.email,
      username = TEST_DATA.username,
      password = TEST_DATA.password
    ) {
      console.log('📝 填充注册表单');
      const inputs = document.querySelectorAll('input');
      
      inputs.forEach(input => {
        if (input.type === 'email') {
          input.value = email;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (input.placeholder?.includes('用户名')) {
          input.value = username;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (input.type === 'password' && !input.value) {
          input.value = password;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      
      console.log('✅ 注册表单已填充');
    },

    // 启用网络日志
    enableNetworkLogging() {
      console.log('📡 启用网络日志');
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        console.log('🌐 请求:', args[0]);
        return originalFetch.apply(this, args)
          .then(response => {
            console.log('📡 响应:', response.status, response.statusText);
            return response;
          })
          .catch(error => {
            console.error('❌ 请求失败:', error);
            throw error;
          });
      };
    },

    // 禁用网络日志
    disableNetworkLogging() {
      console.log('📡 禁用网络日志');
      // 注意：这里需要保存原始的 fetch 函数
      // 在实际使用中，应该更仔细地管理这个
    },
  };
};

// 在开发环境中将调试助手添加到全局对象
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const debugHelpers = createDebugHelpers();
  
  // 添加到 window 对象
  (window as any).debug = debugHelpers;
  
  // 输出使用说明
  console.log(`
🔧 Web 调试助手已加载！

可用命令:
• debug.testLogin() - 测试登录
• debug.testRegister() - 测试注册
• debug.logout() - 登出
• debug.clearAuth() - 清除认证数据
• debug.getAuthState() - 获取认证状态
• debug.getStoredData() - 获取存储数据
• debug.testAPI() - 测试 API 连接
• debug.testHealth() - 测试健康检查
• debug.goToAuth() - 跳转到认证页面
• debug.goToHome() - 跳转到主页
• debug.fillLoginForm() - 填充登录表单
• debug.fillRegisterForm() - 填充注册表单
• debug.enableNetworkLogging() - 启用网络日志

示例:
debug.testLogin('test@example.com', 'password123')
debug.fillLoginForm()
debug.getAuthState()
  `);
}

export default createDebugHelpers;
