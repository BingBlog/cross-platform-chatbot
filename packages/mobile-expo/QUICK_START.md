# 快速开始 - Web 调试登录页面

## 🚀 一键启动

### 方法一：使用快速启动脚本（推荐）

```bash
# 在项目根目录
npm run dev:all
```

这个脚本会：
- 自动检查依赖
- 启动后端服务 (http://localhost:3000)
- 启动前端服务 (http://localhost:8081)
- 显示所有服务状态

### 方法二：手动启动

```bash
# 1. 启动后端服务
cd packages/backend
npm run dev

# 2. 启动前端服务（新终端）
cd packages/mobile-expo
npm run web:debug
```

### 方法三：使用 Expo 调试脚本

```bash
cd packages/mobile-expo
npm run web:debug
```

## 🌐 访问应用

启动成功后，在浏览器中访问：

- **主要地址**: http://localhost:8081
- **备用地址**: http://localhost:19006
- **认证页面**: http://localhost:8081/auth

## 🔧 调试工具

### 浏览器开发者工具

1. **打开开发者工具**: `F12`
2. **主要面板**:
   - **Console**: 查看日志和错误
   - **Network**: 监控 API 请求
   - **Application**: 查看本地存储
   - **Sources**: 设置断点

### 控制台调试助手

在浏览器控制台中，你可以使用以下命令：

```javascript
// 测试登录
debug.testLogin('test@example.com', 'password123')

// 测试注册
debug.testRegister('test@example.com', 'testuser', 'password123')

// 查看认证状态
debug.getAuthState()

// 清除认证数据
debug.clearAuth()

// 填充登录表单
debug.fillLoginForm()

// 跳转到认证页面
debug.goToAuth()
```

## 🧪 测试数据

使用以下测试数据进行调试：

- **邮箱**: test@example.com
- **密码**: password123
- **用户名**: testuser

## 📋 调试清单

### 基本功能检查

- [ ] 页面正常加载
- [ ] 登录表单显示正常
- [ ] 注册表单显示正常
- [ ] 表单验证工作正常
- [ ] 错误信息正确显示

### API 连接检查

- [ ] 后端服务运行正常
- [ ] API 请求成功发送
- [ ] 响应正确解析
- [ ] 错误处理正常

### 状态管理检查

- [ ] 登录状态正确保存
- [ ] 用户信息正确存储
- [ ] 页面刷新后状态保持
- [ ] 登出后状态正确清除

## 🐛 常见问题

### 1. 页面无法访问

**问题**: 访问 http://localhost:8081 显示无法连接

**解决方案**:
```bash
# 检查服务状态
npm run dev:mobile-expo:web --check

# 重新启动服务
npm run dev:mobile-expo:web
```

### 2. API 连接失败

**问题**: 登录时显示网络错误

**解决方案**:
```bash
# 检查后端服务
curl http://localhost:3000/health

# 启动后端服务
cd packages/backend
npm run dev
```

### 3. CORS 错误

**问题**: 浏览器控制台显示 CORS 错误

**解决方案**: 检查后端 CORS 配置，确保包含前端地址

### 4. 认证状态异常

**问题**: 登录后状态不正确

**解决方案**:
```javascript
// 在控制台中清除状态
debug.clearAuth()
// 刷新页面
location.reload()
```

## 📚 更多信息

- **详细调试指南**: [WEB_DEBUG_GUIDE.md](./WEB_DEBUG_GUIDE.md)
- **认证功能说明**: [AUTH_SETUP.md](./AUTH_SETUP.md)
- **API 测试脚本**: `node scripts/test-auth.js`

## 🆘 获取帮助

如果遇到问题：

1. 查看浏览器控制台错误信息
2. 检查 Network 面板的请求状态
3. 查看后端服务日志
4. 使用调试助手进行测试

---

*最后更新: 2024年12月*
