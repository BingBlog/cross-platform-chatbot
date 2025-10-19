import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// 种子数据
const seedData = {
  users: [
    {
      email: 'admin@chatbot.com',
      username: 'admin',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      bio: '系统管理员',
      isActive: true,
      isEmailVerified: true,
    },
    {
      email: 'demo@chatbot.com',
      username: 'demo',
      password: 'demo123',
      firstName: 'Demo',
      lastName: 'User',
      bio: '演示用户',
      isActive: true,
      isEmailVerified: true,
    },
    {
      email: 'test@chatbot.com',
      username: 'testuser',
      password: 'test123',
      firstName: 'Test',
      lastName: 'User',
      bio: '测试用户',
      isActive: true,
      isEmailVerified: true,
    },
  ],
  systemConfig: [
    {
      key: 'app_name',
      value: 'Cross-Platform AI Chatbot',
      description: '应用程序名称',
    },
    {
      key: 'app_version',
      value: '1.0.0',
      description: '应用程序版本',
    },
    {
      key: 'max_sessions_per_user',
      value: '1000',
      description: '每个用户最大会话数',
    },
    {
      key: 'max_messages_per_session',
      value: '10000',
      description: '每个会话最大消息数',
    },
    {
      key: 'max_file_size',
      value: '10485760',
      description: '最大文件大小（字节）',
    },
    {
      key: 'supported_file_types',
      value: 'jpg,jpeg,png,gif,pdf,txt,md,json',
      description: '支持的文件类型',
    },
    {
      key: 'default_ai_model',
      value: 'qwen-turbo',
      description: '默认AI模型',
    },
    {
      key: 'max_tokens_per_request',
      value: '4000',
      description: '每次请求最大Token数',
    },
    {
      key: 'rate_limit_per_minute',
      value: '60',
      description: '每分钟请求限制',
    },
    {
      key: 'session_timeout_minutes',
      value: '1440',
      description: '会话超时时间（分钟）',
    },
    {
      key: 'backup_retention_days',
      value: '30',
      description: '备份保留天数',
    },
    {
      key: 'log_retention_days',
      value: '90',
      description: '日志保留天数',
    },
    {
      key: 'default_theme',
      value: 'light',
      description: '默认主题',
    },
    {
      key: 'default_language',
      value: 'zh-CN',
      description: '默认语言',
    },
    {
      key: 'enable_registration',
      value: 'true',
      description: '是否允许用户注册',
    },
    {
      key: 'enable_guest_mode',
      value: 'false',
      description: '是否启用访客模式',
    },
  ],
};

// 示例聊天会话数据
const sampleSessions = [
  {
    title: '欢迎使用AI聊天机器人',
    description: '这是您的第一个聊天会话，可以开始与AI助手对话了！',
    aiModel: 'qwen-turbo',
    systemPrompt: '你是一个友善、有帮助的AI助手。请用中文回答问题，并尽量提供详细和有用的信息。',
    temperature: 0.7,
    maxTokens: 2000,
  },
  {
    title: '编程问题讨论',
    description: '讨论编程相关的技术问题',
    aiModel: 'qwen-turbo',
    systemPrompt: '你是一个专业的编程助手。请用中文回答编程问题，提供代码示例和最佳实践。',
    temperature: 0.3,
    maxTokens: 3000,
  },
  {
    title: '创意写作助手',
    description: '帮助进行创意写作和内容创作',
    aiModel: 'qwen-turbo',
    systemPrompt: '你是一个创意写作助手。请用中文帮助用户进行创意写作，提供灵感和建议。',
    temperature: 0.9,
    maxTokens: 2500,
  },
];

// 示例消息数据
const sampleMessages = [
  {
    role: 'SYSTEM' as const,
    content: '你好！我是你的AI助手，很高兴为你服务。',
    contentType: 'TEXT' as const,
  },
  {
    role: 'USER' as const,
    content: '你好，请介绍一下你的功能。',
    contentType: 'TEXT' as const,
  },
  {
    role: 'ASSISTANT' as const,
    content: '我是一个多功能的AI助手，可以帮助你：\n\n1. **回答问题** - 提供各种知识问答\n2. **编程帮助** - 代码编写、调试、优化\n3. **创意写作** - 文章写作、故事创作\n4. **学习辅导** - 解释概念、提供学习建议\n5. **日常对话** - 闲聊、情感支持\n\n你有什么具体需求吗？',
    contentType: 'MARKDOWN' as const,
    tokenCount: 120,
  },
];

async function seed() {
  try {
    console.log('🌱 开始种子数据初始化...');

    // 清理现有数据
    console.log('🧹 清理现有数据...');
    await prisma.systemLog.deleteMany();
    await prisma.apiUsage.deleteMany();
    await prisma.searchHistory.deleteMany();
    await prisma.sessionTag.deleteMany();
    await prisma.favoriteSession.deleteMany();
    await prisma.messageAttachment.deleteMany();
    await prisma.message.deleteMany();
    await prisma.chatSession.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.userSettings.deleteMany();
    await prisma.user.deleteMany();
    await prisma.systemConfig.deleteMany();
    await prisma.dataBackup.deleteMany();

    // 创建系统配置
    console.log('⚙️ 创建系统配置...');
    for (const config of seedData.systemConfig) {
      await prisma.systemConfig.create({
        data: config,
      });
    }

    // 创建用户
    console.log('👥 创建用户...');
    const createdUsers: any[] = [];
    for (const userData of seedData.users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
          emailVerifiedAt: new Date(),
          lastLoginAt: new Date(),
          loginCount: 1,
          preferences: {
            theme: 'light',
            language: 'zh-CN',
            fontSize: 14,
            enableNotifications: true,
            enableSound: true,
          },
        },
      });
      createdUsers.push(user);

      // 创建用户设置
      await prisma.userSettings.create({
        data: {
          userId: user.id,
          theme: 'light',
          language: 'zh-CN',
          fontSize: 14,
          enableNotifications: true,
          enableSound: true,
          autoSave: true,
          defaultAiModel: 'qwen-turbo',
          apiSettings: {
            temperature: 0.7,
            maxTokens: 2000,
          },
          uiPreferences: {
            sidebarCollapsed: false,
            messageBubbleStyle: 'rounded',
          },
        },
      });
    }

    // 为每个用户创建示例会话
    console.log('💬 创建示例聊天会话...');
    for (const user of createdUsers) {
      for (const sessionData of sampleSessions) {
        const session = await prisma.chatSession.create({
          data: {
            userId: user.id,
            ...sessionData,
            messageCount: 0,
            lastMessageAt: new Date(),
            metadata: {
              createdBy: 'system',
              isSample: true,
            },
          },
        });

        // 为每个会话创建示例消息
        for (const messageData of sampleMessages) {
          await prisma.message.create({
            data: {
              sessionId: session.id,
              userId: user.id,
              ...messageData,
              metadata: {
                isSample: true,
              },
            },
          });
        }

        // 更新会话消息数量
        const messageCount = await prisma.message.count({
          where: { sessionId: session.id },
        });
        
        await prisma.chatSession.update({
          where: { id: session.id },
          data: { messageCount },
        });

        // 为第一个会话添加标签和收藏
        if (sessionData.title === '欢迎使用AI聊天机器人') {
          await prisma.sessionTag.create({
            data: {
              userId: user.id,
              sessionId: session.id,
              tagName: '欢迎',
              color: '#4CAF50',
            },
          });

          await prisma.favoriteSession.create({
            data: {
              userId: user.id,
              sessionId: session.id,
            },
          });
        }
      }
    }

    // 创建示例API使用统计
    console.log('📊 创建示例API使用统计...');
    for (const user of createdUsers) {
      for (let i = 0; i < 10; i++) {
        await prisma.apiUsage.create({
          data: {
            userId: user.id,
            apiProvider: 'qwen',
            model: 'qwen-turbo',
            requestType: 'chat',
            promptTokens: Math.floor(Math.random() * 100) + 50,
            completionTokens: Math.floor(Math.random() * 200) + 100,
            totalTokens: Math.floor(Math.random() * 300) + 150,
            cost: Math.random() * 0.01,
            responseTime: Math.floor(Math.random() * 2000) + 500,
            success: Math.random() > 0.1,
            errorMessage: Math.random() > 0.9 ? 'API rate limit exceeded' : null,
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // 最近7天
          },
        });
      }
    }

    // 创建示例搜索历史
    console.log('🔍 创建示例搜索历史...');
    const searchQueries = [
      '如何学习编程',
      'JavaScript最佳实践',
      'React组件设计',
      '数据库优化',
      'AI技术发展',
      '机器学习入门',
      '前端框架比较',
      '后端架构设计',
    ];

    for (const user of createdUsers) {
      for (let i = 0; i < 5; i++) {
        const query = searchQueries[Math.floor(Math.random() * searchQueries.length)];
        await prisma.searchHistory.create({
          data: {
            userId: user.id,
            query,
            resultCount: Math.floor(Math.random() * 50) + 1,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // 最近30天
          },
        });
      }
    }

    // 创建示例系统日志
    console.log('📝 创建示例系统日志...');
    const logLevels = ['INFO', 'WARN', 'ERROR', 'DEBUG'] as const;
    const categories = ['auth', 'api', 'database', 'user', 'system'];

    for (let i = 0; i < 50; i++) {
      await prisma.systemLog.create({
        data: {
          level: logLevels[Math.floor(Math.random() * logLevels.length)],
          category: categories[Math.floor(Math.random() * categories.length)],
          message: `示例系统日志消息 ${i + 1}`,
          context: {
            requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
          },
          userId: createdUsers[Math.floor(Math.random() * createdUsers.length)].id,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (compatible; ChatBot/1.0)',
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // 最近7天
        },
      });
    }

    console.log('✅ 种子数据初始化完成！');
    console.log(`📊 创建了 ${createdUsers.length} 个用户`);
    console.log(`💬 创建了 ${createdUsers.length * sampleSessions.length} 个聊天会话`);
    console.log(`💭 创建了 ${createdUsers.length * sampleSessions.length * sampleMessages.length} 条消息`);
    console.log(`⚙️ 创建了 ${seedData.systemConfig.length} 个系统配置`);

  } catch (error) {
    console.error('❌ 种子数据初始化失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 运行种子数据
if (require.main === module) {
  seed()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export default seed;
