# Web 调试指南 - 登录页面

## 概述

本指南将帮助你在 web 环境中调试 mobile-expo 应用的登录页面功能。

## 🚀 快速开始

### 1. 启动后端服务

首先确保后端服务正在运行：

```bash
# 在项目根目录
cd packages/backend
npm run dev
```

后端服务将在 `http://localhost:3000` 启动。

### 2. 启动 Web 开发服务器

```bash
# 在 mobile-expo 目录
cd packages/mobile-expo
npm run web
```

或者使用 Expo CLI：

```bash
npx expo start --web
```

### 3. 访问应用

打开浏览器访问：`http://localhost:8081` 或 `http://localhost:19006`

## 🔧 调试配置

### 浏览器开发者工具

1. **打开开发者工具**：
   - Chrome/Edge: `F12` 或 `Ctrl+Shift+I`
   - Firefox: `F12` 或 `Ctrl+Shift+I`
   - Safari: `Cmd+Option+I`

2. **主要调试面板**：
   - **Console**: 查看日志和错误信息
   - **Network**: 监控 API 请求
   - **Application**: 查看本地存储
   - **Sources**: 设置断点和调试代码

### 网络请求调试

在 Network 面板中监控 API 请求：

1. 打开 Network 面板
2. 刷新页面或执行登录操作
3. 查看以下请求：
   - `POST /api/auth/login` - 登录请求
   - `POST /api/auth/register` - 注册请求
   - `POST /api/auth/logout` - 登出请求

### 本地存储调试

在 Application 面板中查看存储的数据：

1. 打开 Application 面板
2. 展开 Local Storage
3. 查看以下键值：
   - `auth_token` - 访问令牌
   - `user_info` - 用户信息
   - `auth-storage` - Zustand 状态

## 🐛 常见问题调试

### 1. CORS 错误

如果遇到 CORS 错误，检查后端 CORS 配置：

```typescript
// packages/backend/src/app.ts
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8081',  // Expo web dev server
      'http://localhost:19006', // Expo web dev server (alternative)
    ],
    credentials: true,
  })
);
```

### 2. API 连接失败

检查 API 基础 URL 配置：

```typescript
// packages/mobile-expo/lib/api.ts
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // 确保端口正确
  : 'https://your-production-api.com/api';
```

### 3. 认证状态问题

在 Console 中检查认证状态：

```javascript
// 在浏览器控制台中执行
console.log('Auth State:', window.__ZUSTAND_STORE__);
```

### 4. 路由问题

检查路由配置：

```typescript
// packages/mobile-expo/app/_layout.tsx
<Stack>
  <Stack.Screen name="auth" options={{ headerShown: false }} />
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
</Stack>
```

## 🔍 调试技巧

### 1. 添加调试日志

在关键位置添加 console.log：

```typescript
// packages/mobile-expo/lib/auth-store.ts
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      login: async (email: string, password: string) => {
        console.log('🔐 开始登录:', { email });
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(email, password);
          console.log('✅ 登录成功:', response.data);
          // ... 其他代码
        } catch (error) {
          console.error('❌ 登录失败:', error);
          // ... 错误处理
        }
      },
    }),
    // ... 其他配置
  )
);
```

### 2. 使用 React DevTools

安装 React DevTools 浏览器扩展：

1. 安装 [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
2. 在 Components 面板中查看组件状态
3. 在 Profiler 面板中分析性能

### 3. 网络请求拦截

在浏览器控制台中拦截网络请求：

```javascript
// 拦截所有 API 请求
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('🌐 API Request:', args);
  return originalFetch.apply(this, args)
    .then(response => {
      console.log('📡 API Response:', response);
      return response;
    });
};
```

### 4. 状态管理调试

使用 Zustand DevTools：

```typescript
// packages/mobile-expo/lib/auth-store.ts
import { devtools } from 'zustand/middleware';

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) => ({
        // ... store 实现
      }),
      {
        name: 'auth-storage',
        // ... 其他配置
      }
    ),
    {
      name: 'auth-store', // DevTools 中显示的名称
    }
  )
);
```

## 📱 响应式调试

### 1. 设备模拟

在浏览器中模拟不同设备：

1. 打开开发者工具
2. 点击设备模拟图标（📱）
3. 选择设备类型：
   - iPhone SE
   - iPhone 12 Pro
   - iPad
   - 自定义尺寸

### 2. 触摸事件调试

在 Console 中模拟触摸事件：

```javascript
// 模拟点击登录按钮
document.querySelector('[data-testid="login-button"]')?.click();

// 模拟输入
const emailInput = document.querySelector('input[type="email"]');
emailInput.value = 'test@example.com';
emailInput.dispatchEvent(new Event('input', { bubbles: true }));
```

## 🧪 测试数据

### 测试用户账户

使用以下测试数据进行调试：

```javascript
// 测试登录数据
const testCredentials = {
  email: 'test@example.com',
  password: 'password123',
  username: 'testuser'
};

// 在控制台中快速登录
window.testLogin = async () => {
  const { useAuthStore } = await import('./lib/auth-store');
  const { login } = useAuthStore.getState();
  await login(testCredentials.email, testCredentials.password);
};
```

### 清除测试数据

```javascript
// 清除所有认证数据
window.clearAuth = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
  localStorage.removeItem('auth-storage');
  window.location.reload();
};
```

## 🚀 性能调试

### 1. 网络性能

在 Network 面板中检查：

- 请求时间
- 响应大小
- 缓存状态
- 并发请求数

### 2. 渲染性能

使用 React DevTools Profiler：

1. 打开 Profiler 面板
2. 点击录制按钮
3. 执行登录操作
4. 停止录制并分析结果

### 3. 内存使用

在 Memory 面板中检查内存泄漏：

1. 打开 Memory 面板
2. 执行多次登录/登出操作
3. 检查内存使用情况

## 📋 调试清单

### 登录功能检查

- [ ] 页面正常加载
- [ ] 表单验证工作正常
- [ ] API 请求成功发送
- [ ] 响应正确解析
- [ ] 状态正确更新
- [ ] 路由正确跳转
- [ ] 错误信息正确显示

### 注册功能检查

- [ ] 表单验证工作正常
- [ ] 密码确认验证
- [ ] 邮箱格式验证
- [ ] 用户名长度验证
- [ ] 注册成功后自动登录

### 状态管理检查

- [ ] 登录状态正确保存
- [ ] 用户信息正确存储
- [ ] 页面刷新后状态保持
- [ ] 登出后状态正确清除

## 🔧 开发工具推荐

### 浏览器扩展

1. **React Developer Tools** - React 组件调试
2. **Redux DevTools** - 状态管理调试
3. **Axios DevTools** - API 请求调试
4. **JSON Formatter** - JSON 数据格式化

### VS Code 扩展

1. **React Native Tools** - React Native 开发支持
2. **Expo Tools** - Expo 开发支持
3. **TypeScript Importer** - TypeScript 导入支持
4. **Auto Rename Tag** - 标签自动重命名

## 📞 获取帮助

如果遇到问题：

1. 检查浏览器控制台错误信息
2. 查看 Network 面板的请求状态
3. 检查后端服务日志
4. 参考 [Expo Web 文档](https://docs.expo.dev/workflow/web/)
5. 查看 [React Native Web 文档](https://necolas.github.io/react-native-web/)

---

*最后更新: 2024年12月*
