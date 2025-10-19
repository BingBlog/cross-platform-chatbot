# 移动端认证功能设置说明

## 概述

已为 mobile-expo 应用添加了完整的认证功能，包括登录、注册和状态管理。

## 功能特性

### ✅ 已实现功能

1. **用户登录**
   - 邮箱和密码验证
   - 与后端API集成
   - 错误处理和用户反馈

2. **用户注册**
   - 邮箱、用户名、密码输入
   - 密码确认验证
   - 输入格式验证

3. **状态管理**
   - 使用Zustand进行全局状态管理
   - 持久化存储用户信息
   - 自动token管理

4. **UI组件**
   - 响应式设计，支持深色/浅色主题
   - 表单验证和错误显示
   - 加载状态指示器

5. **路由管理**
   - 认证守卫
   - 自动路由跳转
   - 登出功能

## 文件结构

```
packages/mobile-expo/
├── app/
│   ├── auth.tsx                 # 认证页面（登录/注册）
│   ├── _layout.tsx             # 根布局（已更新）
│   └── (tabs)/
│       └── index.tsx           # 主页面（已更新）
├── components/
│   └── auth/
│       ├── LoginForm.tsx       # 登录表单组件
│       ├── RegisterForm.tsx    # 注册表单组件
│       ├── AuthGuard.tsx       # 认证守卫组件
│       └── index.ts           # 组件导出
├── lib/
│   ├── api.ts                 # API客户端配置
│   ├── auth-store.ts          # 认证状态管理
│   └── index.ts              # 库导出
└── AUTH_SETUP.md             # 本文档
```

## 使用方法

### 1. 启动应用

```bash
cd packages/mobile-expo
npm start
```

### 2. 访问认证页面

应用启动后，访问 `/auth` 路由即可看到登录/注册页面。

### 3. 测试功能

- **登录**: 使用已注册的邮箱和密码
- **注册**: 创建新账户
- **登出**: 在主页面点击登出按钮

## API配置

### 后端API地址

在 `lib/api.ts` 中配置API地址：

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // 开发环境
  : 'https://your-production-api.com/api';  // 生产环境
```

### 支持的API端点

- `POST /auth/login` - 用户登录
- `POST /auth/register` - 用户注册
- `POST /auth/logout` - 用户登出
- `POST /auth/refresh` - 刷新token

## 状态管理

### 认证状态

```typescript
const { 
  user,           // 用户信息
  isAuthenticated, // 认证状态
  isLoading,      // 加载状态
  error,          // 错误信息
  login,          // 登录方法
  register,       // 注册方法
  logout          // 登出方法
} = useAuthStore();
```

### 持久化存储

用户认证信息会自动保存到 AsyncStorage，应用重启后会自动恢复登录状态。

## 自定义配置

### 主题配置

认证页面会自动适配应用的深色/浅色主题，颜色配置在 `constants/theme.ts` 中。

### 表单验证

可以在 `LoginForm.tsx` 和 `RegisterForm.tsx` 中自定义验证规则。

### API响应处理

在 `lib/api.ts` 中可以自定义请求/响应拦截器。

## 下一步开发

1. **完善用户资料管理**
   - 头像上传
   - 个人信息编辑
   - 密码修改

2. **增强安全性**
   - 生物识别登录
   - 两步验证
   - 会话管理

3. **用户体验优化**
   - 记住登录状态
   - 自动登录
   - 登录历史

## 故障排除

### 常见问题

1. **API连接失败**
   - 检查后端服务是否运行
   - 确认API地址配置正确
   - 检查网络连接

2. **认证状态不持久**
   - 确认AsyncStorage权限
   - 检查存储配置

3. **UI显示异常**
   - 检查主题配置
   - 确认组件导入正确

### 调试模式

在开发环境中，可以在控制台查看详细的API请求和响应信息。

## 依赖项

- `axios` - HTTP客户端
- `zustand` - 状态管理
- `@react-native-async-storage/async-storage` - 本地存储
- `@tanstack/react-query` - 数据获取（已安装但未使用）

---

*最后更新: 2024年12月*
