import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface InitResult {
  success: boolean;
  message: string;
  steps: string[];
}

class DatabaseInitializer {
  private prisma: PrismaClient;
  private steps: string[] = [];

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 初始化数据库
   */
  async initialize(): Promise<InitResult> {
    try {
      console.log('🚀 开始数据库初始化...');
      this.steps = [];

      // 步骤1: 检查环境变量
      await this.checkEnvironmentVariables();
      this.steps.push('✅ 环境变量检查完成');

      // 步骤2: 检查数据库连接
      await this.checkDatabaseConnection();
      this.steps.push('✅ 数据库连接检查完成');

      // 步骤3: 运行数据库迁移
      await this.runMigrations();
      this.steps.push('✅ 数据库迁移完成');

      // 步骤4: 创建数据库函数和触发器
      await this.createDatabaseFunctions();
      this.steps.push('✅ 数据库函数和触发器创建完成');

      // 步骤5: 创建索引
      await this.createIndexes();
      this.steps.push('✅ 数据库索引创建完成');

      // 步骤6: 插入系统配置
      await this.insertSystemConfigs();
      this.steps.push('✅ 系统配置插入完成');

      // 步骤7: 验证初始化结果
      await this.validateInitialization();
      this.steps.push('✅ 初始化验证完成');

      console.log('🎉 数据库初始化成功完成！');
      console.log('📋 完成步骤:');
      this.steps.forEach((step, index) => {
        console.log(`  ${index + 1}. ${step}`);
      });

      return {
        success: true,
        message: '数据库初始化成功完成',
        steps: this.steps
      };

    } catch (error) {
      console.error('❌ 数据库初始化失败:', error);
      return {
        success: false,
        message: `数据库初始化失败: ${error.message}`,
        steps: this.steps
      };
    } finally {
      await this.prisma.$disconnect();
    }
  }

  /**
   * 检查环境变量
   */
  private async checkEnvironmentVariables(): Promise<void> {
    console.log('🔍 检查环境变量...');
    
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'REDIS_URL'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`缺少必需的环境变量: ${missingVars.join(', ')}`);
    }

    console.log('✅ 环境变量检查通过');
  }

  /**
   * 检查数据库连接
   */
  private async checkDatabaseConnection(): Promise<void> {
    console.log('🔍 检查数据库连接...');
    
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      console.log('✅ 数据库连接正常');
    } catch (error) {
      throw new Error(`数据库连接失败: ${error.message}`);
    }
  }

  /**
   * 运行数据库迁移
   */
  private async runMigrations(): Promise<void> {
    console.log('🔄 运行数据库迁移...');
    
    try {
      // 生成Prisma客户端
      execSync('npx prisma generate', { stdio: 'inherit' });
      
      // 推送数据库schema
      execSync('npx prisma db push', { stdio: 'inherit' });
      
      console.log('✅ 数据库迁移完成');
    } catch (error) {
      throw new Error(`数据库迁移失败: ${error.message}`);
    }
  }

  /**
   * 创建数据库函数和触发器
   */
  private async createDatabaseFunctions(): Promise<void> {
    console.log('🔧 创建数据库函数和触发器...');
    
    try {
      // 读取SQL脚本
      const sqlPath = path.join(__dirname, 'init-db.sql');
      if (fs.existsSync(sqlPath)) {
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        
        // 分割SQL语句并执行
        const statements = sqlContent
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        for (const statement of statements) {
          if (statement.trim()) {
            try {
              await this.prisma.$executeRawUnsafe(statement);
            } catch (error) {
              // 忽略已存在的函数/触发器的错误
              if (!error.message.includes('already exists')) {
                console.warn(`⚠️ SQL语句执行警告: ${error.message}`);
              }
            }
          }
        }
      }
      
      console.log('✅ 数据库函数和触发器创建完成');
    } catch (error) {
      console.warn(`⚠️ 创建数据库函数时出现警告: ${error.message}`);
    }
  }

  /**
   * 创建数据库索引
   */
  private async createIndexes(): Promise<void> {
    console.log('📊 创建数据库索引...');
    
    try {
      // 创建复合索引
      const indexes = [
        // 用户表索引
        'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
        'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)',
        'CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active)',
        'CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_at)',
        
        // 会话表索引
        'CREATE INDEX IF NOT EXISTS idx_sessions_user_created ON chat_sessions(user_id, created_at)',
        'CREATE INDEX IF NOT EXISTS idx_sessions_user_updated ON chat_sessions(user_id, last_message_at)',
        'CREATE INDEX IF NOT EXISTS idx_sessions_archived ON chat_sessions(is_archived)',
        'CREATE INDEX IF NOT EXISTS idx_sessions_favorite ON chat_sessions(is_favorite)',
        'CREATE INDEX IF NOT EXISTS idx_sessions_pinned ON chat_sessions(is_pinned)',
        
        // 消息表索引
        'CREATE INDEX IF NOT EXISTS idx_messages_session_created ON messages(session_id, created_at)',
        'CREATE INDEX IF NOT EXISTS idx_messages_user_created ON messages(user_id, created_at)',
        'CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(role)',
        'CREATE INDEX IF NOT EXISTS idx_messages_content_type ON messages(content_type)',
        
        // 用户会话表索引
        'CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token)',
        'CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at)',
        'CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active)',
        
        // API使用统计表索引
        'CREATE INDEX IF NOT EXISTS idx_api_usage_user_date ON api_usage(user_id, created_at)',
        'CREATE INDEX IF NOT EXISTS idx_api_usage_provider ON api_usage(api_provider)',
        'CREATE INDEX IF NOT EXISTS idx_api_usage_success ON api_usage(success)',
        
        // 系统日志表索引
        'CREATE INDEX IF NOT EXISTS idx_system_logs_level_date ON system_logs(level, created_at)',
        'CREATE INDEX IF NOT EXISTS idx_system_logs_category ON system_logs(category)',
        'CREATE INDEX IF NOT EXISTS idx_system_logs_user ON system_logs(user_id)',
        
        // 搜索历史表索引
        'CREATE INDEX IF NOT EXISTS idx_search_history_user_date ON search_history(user_id, created_at)',
        
        // 全文搜索索引
        'CREATE INDEX IF NOT EXISTS idx_messages_content_fts ON messages USING gin(to_tsvector(\'chatbot_search\', content))',
        'CREATE INDEX IF NOT EXISTS idx_sessions_title_fts ON chat_sessions USING gin(to_tsvector(\'chatbot_search\', title))',
      ];

      for (const indexSql of indexes) {
        try {
          await this.prisma.$executeRawUnsafe(indexSql);
        } catch (error) {
          console.warn(`⚠️ 创建索引警告: ${error.message}`);
        }
      }
      
      console.log('✅ 数据库索引创建完成');
    } catch (error) {
      console.warn(`⚠️ 创建索引时出现警告: ${error.message}`);
    }
  }

  /**
   * 插入系统配置
   */
  private async insertSystemConfigs(): Promise<void> {
    console.log('⚙️ 插入系统配置...');
    
    const systemConfigs = [
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
      {
        key: 'maintenance_mode',
        value: 'false',
        description: '维护模式',
      },
      {
        key: 'debug_mode',
        value: 'false',
        description: '调试模式',
      },
    ];

    for (const config of systemConfigs) {
      await this.prisma.systemConfig.upsert({
        where: { key: config.key },
        update: { value: config.value, description: config.description },
        create: config,
      });
    }
    
    console.log(`✅ 插入了 ${systemConfigs.length} 个系统配置`);
  }

  /**
   * 验证初始化结果
   */
  private async validateInitialization(): Promise<void> {
    console.log('🔍 验证初始化结果...');
    
    try {
      // 检查表是否存在
      const tables = await this.prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `;

      const expectedTables = [
        'users',
        'chat_sessions',
        'messages',
        'message_attachments',
        'user_settings',
        'user_sessions',
        'favorite_sessions',
        'session_tags',
        'search_history',
        'api_usage',
        'system_config',
        'system_logs',
        'data_backups'
      ];

      const existingTables = (tables as any[]).map(t => t.table_name);
      const missingTables = expectedTables.filter(table => !existingTables.includes(table));

      if (missingTables.length > 0) {
        throw new Error(`缺少表: ${missingTables.join(', ')}`);
      }

      // 检查系统配置
      const configCount = await this.prisma.systemConfig.count();
      if (configCount === 0) {
        throw new Error('系统配置未正确插入');
      }

      // 检查数据库函数
      const functions = await this.prisma.$queryRaw`
        SELECT routine_name 
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND routine_type = 'FUNCTION'
      `;

      console.log(`✅ 验证通过 - 表: ${existingTables.length}, 配置: ${configCount}, 函数: ${(functions as any[]).length}`);
      
    } catch (error) {
      throw new Error(`初始化验证失败: ${error.message}`);
    }
  }

  /**
   * 获取数据库信息
   */
  async getDatabaseInfo(): Promise<any> {
    try {
      const [
        tableCount,
        configCount,
        functionCount,
        indexCount
      ] = await Promise.all([
        this.prisma.$queryRaw`SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'`,
        this.prisma.systemConfig.count(),
        this.prisma.$queryRaw`SELECT COUNT(*) as count FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'`,
        this.prisma.$queryRaw`SELECT COUNT(*) as count FROM pg_indexes WHERE schemaname = 'public'`
      ]);

      return {
        tables: (tableCount as any[])[0].count,
        configs: configCount,
        functions: (functionCount as any[])[0].count,
        indexes: (indexCount as any[])[0].count,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`获取数据库信息失败: ${error.message}`);
    }
  }
}

// 命令行接口
async function main() {
  const initializer = new DatabaseInitializer();
  const command = process.argv[2];

  try {
    switch (command) {
      case 'init':
        const result = await initializer.initialize();
        console.log('\n🎯 初始化结果:');
        console.log(`状态: ${result.success ? '成功' : '失败'}`);
        console.log(`消息: ${result.message}`);
        if (!result.success) {
          process.exit(1);
        }
        break;

      case 'info':
        const info = await initializer.getDatabaseInfo();
        console.log('📊 数据库信息:', info);
        break;

      default:
        console.log(`
数据库初始化工具使用说明:

命令:
  init    初始化数据库
  info    获取数据库信息

示例:
  npm run db:init init
  npm run db:init info
        `);
    }
  } catch (error) {
    console.error('❌ 操作失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export default DatabaseInitializer;
