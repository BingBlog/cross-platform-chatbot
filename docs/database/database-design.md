# 跨平台AI聊天机器人 - 数据库设计方案

## 概述

本文档详细描述了跨平台AI聊天机器人的数据库表结构设计，支持桌面、移动端和Web端的完整功能需求。

## 设计原则

1. **数据完整性**: 确保数据的完整性和一致性
2. **性能优化**: 针对查询性能进行优化设计
3. **扩展性**: 支持未来功能扩展
4. **安全性**: 保护用户隐私和数据安全
5. **跨平台兼容**: 支持多平台数据同步

## 数据库架构

### 技术栈
- **数据库**: PostgreSQL 15+
- **ORM**: Prisma 5.0+
- **连接池**: Redis 7+ (缓存)
- **备份策略**: 定期全量备份 + 增量备份

## 表结构设计

### 1. 核心业务表

#### 1.1 用户表 (users)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, CUID | 用户唯一标识 |
| email | String | UNIQUE, NOT NULL | 邮箱地址 |
| username | String | UNIQUE, NOT NULL | 用户名 |
| password | String | NOT NULL | 加密密码 |
| avatar | String | NULL | 头像URL |
| firstName | String | NULL | 名 |
| lastName | String | NULL | 姓 |
| bio | String | NULL | 个人简介 |
| isActive | Boolean | DEFAULT true | 是否激活 |
| isEmailVerified | Boolean | DEFAULT false | 邮箱是否验证 |
| emailVerifiedAt | DateTime | NULL | 邮箱验证时间 |
| lastLoginAt | DateTime | NULL | 最后登录时间 |
| loginCount | Int | DEFAULT 0 | 登录次数 |
| preferences | Json | NULL | 用户偏好设置 |
| createdAt | DateTime | DEFAULT now() | 创建时间 |
| updatedAt | DateTime | AUTO | 更新时间 |

**索引设计**:
- 主键索引: `id`
- 唯一索引: `email`, `username`
- 普通索引: `isActive`, `lastLoginAt`

#### 1.2 聊天会话表 (chat_sessions)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, CUID | 会话唯一标识 |
| userId | String | FK, NOT NULL | 用户ID |
| title | String | NOT NULL | 会话标题 |
| description | String | NULL | 会话描述 |
| messageCount | Int | DEFAULT 0 | 消息数量 |
| lastMessageAt | DateTime | NULL | 最后消息时间 |
| isArchived | Boolean | DEFAULT false | 是否归档 |
| isFavorite | Boolean | DEFAULT false | 是否收藏 |
| isPinned | Boolean | DEFAULT false | 是否置顶 |
| aiModel | String | NULL | 使用的AI模型 |
| systemPrompt | String | NULL | 系统提示词 |
| temperature | Float | NULL | AI温度参数 |
| maxTokens | Int | NULL | 最大Token数 |
| metadata | Json | NULL | 扩展元数据 |
| createdAt | DateTime | DEFAULT now() | 创建时间 |
| updatedAt | DateTime | AUTO | 更新时间 |

**索引设计**:
- 主键索引: `id`
- 外键索引: `userId`
- 复合索引: `(userId, createdAt)`, `(userId, lastMessageAt)`
- 普通索引: `isArchived`, `isFavorite`, `isPinned`

#### 1.3 消息表 (messages)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, CUID | 消息唯一标识 |
| sessionId | String | FK, NOT NULL | 会话ID |
| userId | String | FK, NOT NULL | 用户ID |
| role | MessageRole | NOT NULL | 消息角色 |
| content | String | NOT NULL | 消息内容 |
| contentType | ContentType | DEFAULT TEXT | 内容类型 |
| parentMessageId | String | FK, NULL | 父消息ID |
| isEdited | Boolean | DEFAULT false | 是否编辑过 |
| editHistory | Json | NULL | 编辑历史 |
| tokenCount | Int | NULL | Token数量 |
| processingTime | Int | NULL | 处理时间(毫秒) |
| metadata | Json | NULL | 扩展元数据 |
| createdAt | DateTime | DEFAULT now() | 创建时间 |
| updatedAt | DateTime | AUTO | 更新时间 |

**索引设计**:
- 主键索引: `id`
- 外键索引: `sessionId`, `userId`, `parentMessageId`
- 复合索引: `(sessionId, createdAt)`, `(userId, createdAt)`
- 普通索引: `role`, `contentType`

#### 1.4 消息附件表 (message_attachments)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, CUID | 附件唯一标识 |
| messageId | String | FK, NOT NULL | 消息ID |
| fileName | String | NOT NULL | 文件名 |
| fileType | String | NOT NULL | 文件类型 |
| fileSize | Int | NOT NULL | 文件大小 |
| filePath | String | NOT NULL | 文件路径 |
| mimeType | String | NULL | MIME类型 |
| isProcessed | Boolean | DEFAULT false | 是否已处理 |
| metadata | Json | NULL | 扩展元数据 |
| createdAt | DateTime | DEFAULT now() | 创建时间 |

**索引设计**:
- 主键索引: `id`
- 外键索引: `messageId`
- 普通索引: `fileType`, `isProcessed`

### 2. 用户管理表

#### 2.1 用户设置表 (user_settings)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, CUID | 设置唯一标识 |
| userId | String | FK, UNIQUE, NOT NULL | 用户ID |
| theme | String | DEFAULT "light" | 主题 |
| language | String | DEFAULT "zh-CN" | 语言 |
| fontSize | Int | DEFAULT 14 | 字体大小 |
| enableNotifications | Boolean | DEFAULT true | 启用通知 |
| enableSound | Boolean | DEFAULT true | 启用声音 |
| autoSave | Boolean | DEFAULT true | 自动保存 |
| defaultAiModel | String | NULL | 默认AI模型 |
| apiSettings | Json | NULL | API设置 |
| uiPreferences | Json | NULL | UI偏好设置 |
| createdAt | DateTime | DEFAULT now() | 创建时间 |
| updatedAt | DateTime | AUTO | 更新时间 |

#### 2.2 用户登录会话表 (user_sessions)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, CUID | 会话唯一标识 |
| userId | String | FK, NOT NULL | 用户ID |
| sessionToken | String | UNIQUE, NOT NULL | 会话令牌 |
| refreshToken | String | UNIQUE, NULL | 刷新令牌 |
| deviceInfo | Json | NULL | 设备信息 |
| ipAddress | String | NULL | IP地址 |
| userAgent | String | NULL | 用户代理 |
| isActive | Boolean | DEFAULT true | 是否激活 |
| expiresAt | DateTime | NOT NULL | 过期时间 |
| lastActivityAt | DateTime | DEFAULT now() | 最后活动时间 |
| createdAt | DateTime | DEFAULT now() | 创建时间 |

**索引设计**:
- 主键索引: `id`
- 外键索引: `userId`
- 唯一索引: `sessionToken`, `refreshToken`
- 普通索引: `isActive`, `expiresAt`

### 3. 会话管理表

#### 3.1 收藏会话表 (favorite_sessions)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, CUID | 收藏唯一标识 |
| userId | String | FK, NOT NULL | 用户ID |
| sessionId | String | FK, NOT NULL | 会话ID |
| createdAt | DateTime | DEFAULT now() | 创建时间 |

**索引设计**:
- 主键索引: `id`
- 外键索引: `userId`, `sessionId`
- 唯一复合索引: `(userId, sessionId)`

#### 3.2 会话标签表 (session_tags)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, CUID | 标签唯一标识 |
| userId | String | FK, NOT NULL | 用户ID |
| sessionId | String | FK, NOT NULL | 会话ID |
| tagName | String | NOT NULL | 标签名称 |
| color | String | NULL | 标签颜色 |
| createdAt | DateTime | DEFAULT now() | 创建时间 |

**索引设计**:
- 主键索引: `id`
- 外键索引: `userId`, `sessionId`
- 唯一复合索引: `(userId, sessionId, tagName)`
- 普通索引: `tagName`

#### 3.3 搜索历史表 (search_history)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, CUID | 搜索唯一标识 |
| userId | String | FK, NOT NULL | 用户ID |
| sessionId | String | FK, NULL | 会话ID |
| query | String | NOT NULL | 搜索查询 |
| resultCount | Int | NULL | 结果数量 |
| createdAt | DateTime | DEFAULT now() | 创建时间 |

**索引设计**:
- 主键索引: `id`
- 外键索引: `userId`, `sessionId`
- 复合索引: `(userId, createdAt)`

### 4. 系统管理表

#### 4.1 API使用统计表 (api_usage)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, CUID | 统计唯一标识 |
| userId | String | FK, NOT NULL | 用户ID |
| apiProvider | String | NOT NULL | API提供商 |
| model | String | NOT NULL | 模型名称 |
| requestType | String | NOT NULL | 请求类型 |
| promptTokens | Int | NOT NULL | 提示Token数 |
| completionTokens | Int | NOT NULL | 完成Token数 |
| totalTokens | Int | NOT NULL | 总Token数 |
| cost | Float | NULL | 成本 |
| responseTime | Int | NOT NULL | 响应时间(毫秒) |
| success | Boolean | NOT NULL | 是否成功 |
| errorMessage | String | NULL | 错误信息 |
| createdAt | DateTime | DEFAULT now() | 创建时间 |

**索引设计**:
- 主键索引: `id`
- 外键索引: `userId`
- 复合索引: `(userId, createdAt)`, `(apiProvider, createdAt)`
- 普通索引: `success`

#### 4.2 系统配置表 (system_config)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, CUID | 配置唯一标识 |
| key | String | UNIQUE, NOT NULL | 配置键 |
| value | String | NOT NULL | 配置值 |
| description | String | NULL | 配置描述 |
| isActive | Boolean | DEFAULT true | 是否激活 |
| createdAt | DateTime | DEFAULT now() | 创建时间 |
| updatedAt | DateTime | AUTO | 更新时间 |

#### 4.3 系统日志表 (system_logs)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, CUID | 日志唯一标识 |
| level | LogLevel | NOT NULL | 日志级别 |
| category | String | NOT NULL | 日志分类 |
| message | String | NOT NULL | 日志消息 |
| context | Json | NULL | 上下文信息 |
| userId | String | NULL | 用户ID |
| ipAddress | String | NULL | IP地址 |
| userAgent | String | NULL | 用户代理 |
| createdAt | DateTime | DEFAULT now() | 创建时间 |

**索引设计**:
- 主键索引: `id`
- 复合索引: `(level, createdAt)`, `(category, createdAt)`
- 普通索引: `userId`

#### 4.4 数据备份表 (data_backups)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | String | PK, CUID | 备份唯一标识 |
| type | BackupType | NOT NULL | 备份类型 |
| fileName | String | NOT NULL | 文件名 |
| filePath | String | NOT NULL | 文件路径 |
| fileSize | Int | NOT NULL | 文件大小 |
| recordCount | Int | NULL | 记录数量 |
| status | BackupStatus | DEFAULT PENDING | 备份状态 |
| startedAt | DateTime | DEFAULT now() | 开始时间 |
| completedAt | DateTime | NULL | 完成时间 |
| errorMessage | String | NULL | 错误信息 |

**索引设计**:
- 主键索引: `id`
- 复合索引: `(type, status)`, `(status, startedAt)`

## 枚举类型定义

### MessageRole
- `USER`: 用户消息
- `ASSISTANT`: AI助手消息
- `SYSTEM`: 系统消息

### ContentType
- `TEXT`: 纯文本
- `MARKDOWN`: Markdown格式
- `CODE`: 代码块
- `IMAGE`: 图片
- `FILE`: 文件
- `JSON`: JSON数据

### LogLevel
- `ERROR`: 错误
- `WARN`: 警告
- `INFO`: 信息
- `DEBUG`: 调试

### BackupType
- `FULL`: 全量备份
- `INCREMENTAL`: 增量备份
- `USER_DATA`: 用户数据备份
- `SESSIONS`: 会话数据备份
- `MESSAGES`: 消息数据备份

### BackupStatus
- `PENDING`: 等待中
- `IN_PROGRESS`: 进行中
- `COMPLETED`: 已完成
- `FAILED`: 失败

## 数据关系图

```
User (1) -----> (N) ChatSession
User (1) -----> (N) Message
User (1) -----> (1) UserSettings
User (1) -----> (N) UserSession
User (1) -----> (N) FavoriteSession
User (1) -----> (N) SessionTag
User (1) -----> (N) SearchHistory
User (1) -----> (N) ApiUsage

ChatSession (1) -----> (N) Message
ChatSession (1) -----> (N) FavoriteSession
ChatSession (1) -----> (N) SessionTag
ChatSession (1) -----> (N) SearchHistory

Message (1) -----> (N) MessageAttachment
Message (1) -----> (N) Message (replies)
```

## 性能优化策略

### 1. 索引优化
- 为频繁查询的字段创建索引
- 使用复合索引优化多条件查询
- 定期分析查询性能并优化索引

### 2. 分页策略
- 使用游标分页处理大量数据
- 实现高效的分页查询
- 缓存常用查询结果

### 3. 数据分区
- 按时间分区消息表
- 按用户分区会话表
- 定期清理历史数据

### 4. 缓存策略
- Redis缓存热点数据
- 缓存用户会话信息
- 缓存AI模型配置

## 数据安全策略

### 1. 数据加密
- 密码使用bcrypt加密
- 敏感数据字段加密存储
- 传输过程使用HTTPS

### 2. 访问控制
- 基于角色的访问控制
- 用户数据隔离
- API访问频率限制

### 3. 数据备份
- 定期全量备份
- 实时增量备份
- 异地备份存储

### 4. 审计日志
- 记录所有数据变更
- 监控异常访问
- 定期安全审计

## 扩展性设计

### 1. 水平扩展
- 支持数据库分片
- 读写分离架构
- 负载均衡策略

### 2. 功能扩展
- 预留扩展字段
- 插件化架构支持
- 版本兼容性设计

### 3. 多租户支持
- 数据隔离设计
- 租户级别配置
- 资源配额管理

## 部署建议

### 1. 开发环境
- 使用Docker Compose部署
- 本地PostgreSQL实例
- 开发数据种子文件

### 2. 测试环境
- 镜像生产环境配置
- 自动化测试数据
- 性能测试环境

### 3. 生产环境
- 高可用数据库集群
- 自动备份和恢复
- 监控和告警系统

## 维护计划

### 1. 定期维护
- 数据库性能监控
- 索引优化调整
- 数据清理和归档

### 2. 版本升级
- 数据库版本升级
- 数据迁移脚本
- 回滚方案准备

### 3. 容量规划
- 数据增长预测
- 性能容量评估
- 扩容方案制定

---

*本文档将随着项目发展持续更新和完善。*
