import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface MigrationResult {
  success: boolean;
  message: string;
  changes?: any;
}

class DatabaseMigrator {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * 运行Prisma迁移
   */
  async runMigrations(): Promise<MigrationResult> {
    try {
      console.log('🔄 开始数据库迁移...');
      
      // 生成Prisma客户端
      execSync('npx prisma generate', { stdio: 'inherit' });
      
      // 运行迁移
      execSync('npx prisma db push', { stdio: 'inherit' });
      
      console.log('✅ 数据库迁移完成');
      
      return {
        success: true,
        message: '数据库迁移成功完成'
      };
    } catch (error) {
      console.error('❌ 数据库迁移失败:', error);
      return {
        success: false,
        message: `数据库迁移失败: ${error.message}`
      };
    }
  }

  /**
   * 重置数据库
   */
  async resetDatabase(): Promise<MigrationResult> {
    try {
      console.log('🔄 开始重置数据库...');
      
      // 删除所有数据
      await this.cleanDatabase();
      
      // 重新运行迁移
      const migrationResult = await this.runMigrations();
      
      if (migrationResult.success) {
        console.log('✅ 数据库重置完成');
        return {
          success: true,
          message: '数据库重置成功完成'
        };
      } else {
        return migrationResult;
      }
    } catch (error) {
      console.error('❌ 数据库重置失败:', error);
      return {
        success: false,
        message: `数据库重置失败: ${error.message}`
      };
    }
  }

  /**
   * 清理数据库
   */
  async cleanDatabase(): Promise<void> {
    console.log('🧹 清理数据库...');
    
    // 按依赖关系顺序删除数据
    const tables = [
      'system_logs',
      'api_usage',
      'search_history',
      'session_tags',
      'favorite_sessions',
      'message_attachments',
      'messages',
      'chat_sessions',
      'user_sessions',
      'user_settings',
      'users',
      'system_config',
      'data_backups'
    ];

    for (const table of tables) {
      try {
        await this.prisma.$executeRawUnsafe(`TRUNCATE TABLE ${table} CASCADE;`);
        console.log(`✅ 清理表: ${table}`);
      } catch (error) {
        console.warn(`⚠️ 清理表 ${table} 时出错:`, error.message);
      }
    }
  }

  /**
   * 备份数据库
   */
  async backupDatabase(): Promise<MigrationResult> {
    try {
      console.log('💾 开始数据库备份...');
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `backup_${timestamp}.sql`;
      const backupPath = path.join(process.cwd(), 'backups', backupFileName);
      
      // 确保备份目录存在
      const backupDir = path.dirname(backupPath);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // 获取数据库连接信息
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('DATABASE_URL 环境变量未设置');
      }

      // 解析数据库URL
      const url = new URL(databaseUrl);
      const dbName = url.pathname.slice(1);
      const dbHost = url.hostname;
      const dbPort = url.port || '5432';
      const dbUser = url.username;
      const dbPassword = url.password;

      // 执行备份命令
      const backupCommand = `PGPASSWORD="${dbPassword}" pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} > ${backupPath}`;
      
      execSync(backupCommand, { stdio: 'inherit' });

      // 记录备份信息
      const stats = fs.statSync(backupPath);
      await this.prisma.dataBackup.create({
        data: {
          type: 'FULL',
          fileName: backupFileName,
          filePath: backupPath,
          fileSize: stats.size,
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      console.log(`✅ 数据库备份完成: ${backupPath}`);
      
      return {
        success: true,
        message: `数据库备份成功完成: ${backupFileName}`,
        changes: {
          backupFile: backupPath,
          fileSize: stats.size
        }
      };
    } catch (error) {
      console.error('❌ 数据库备份失败:', error);
      return {
        success: false,
        message: `数据库备份失败: ${error.message}`
      };
    }
  }

  /**
   * 检查数据库连接
   */
  async checkConnection(): Promise<MigrationResult> {
    try {
      console.log('🔍 检查数据库连接...');
      
      await this.prisma.$queryRaw`SELECT 1`;
      
      console.log('✅ 数据库连接正常');
      
      return {
        success: true,
        message: '数据库连接正常'
      };
    } catch (error) {
      console.error('❌ 数据库连接失败:', error);
      return {
        success: false,
        message: `数据库连接失败: ${error.message}`
      };
    }
  }

  /**
   * 获取数据库状态
   */
  async getDatabaseStatus(): Promise<any> {
    try {
      console.log('📊 获取数据库状态...');
      
      const [
        userCount,
        sessionCount,
        messageCount,
        configCount
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.chatSession.count(),
        this.prisma.message.count(),
        this.prisma.systemConfig.count()
      ]);

      const status = {
        users: userCount,
        sessions: sessionCount,
        messages: messageCount,
        configs: configCount,
        timestamp: new Date().toISOString()
      };

      console.log('📊 数据库状态:', status);
      
      return status;
    } catch (error) {
      console.error('❌ 获取数据库状态失败:', error);
      throw error;
    }
  }

  /**
   * 验证数据完整性
   */
  async validateDataIntegrity(): Promise<MigrationResult> {
    try {
      console.log('🔍 验证数据完整性...');
      
      const issues: string[] = [];

      // 检查孤立的会话
      const orphanedSessions = await this.prisma.chatSession.findMany({
        where: {
          user: null
        }
      });
      
      if (orphanedSessions.length > 0) {
        issues.push(`发现 ${orphanedSessions.length} 个孤立会话`);
      }

      // 检查孤立的消息
      const orphanedMessages = await this.prisma.message.findMany({
        where: {
          session: null
        }
      });
      
      if (orphanedMessages.length > 0) {
        issues.push(`发现 ${orphanedMessages.length} 条孤立消息`);
      }

      // 检查会话消息计数不一致
      const sessionsWithIncorrectCount = await this.prisma.$queryRaw`
        SELECT cs.id, cs.message_count, COUNT(m.id) as actual_count
        FROM chat_sessions cs
        LEFT JOIN messages m ON cs.id = m.session_id
        GROUP BY cs.id, cs.message_count
        HAVING cs.message_count != COUNT(m.id)
      `;
      
      if (sessionsWithIncorrectCount.length > 0) {
        issues.push(`发现 ${sessionsWithIncorrectCount.length} 个会话消息计数不一致`);
      }

      if (issues.length > 0) {
        return {
          success: false,
          message: '数据完整性检查发现问题',
          changes: { issues }
        };
      } else {
        console.log('✅ 数据完整性检查通过');
        return {
          success: true,
          message: '数据完整性检查通过'
        };
      }
    } catch (error) {
      console.error('❌ 数据完整性检查失败:', error);
      return {
        success: false,
        message: `数据完整性检查失败: ${error.message}`
      };
    }
  }

  /**
   * 修复数据问题
   */
  async fixDataIssues(): Promise<MigrationResult> {
    try {
      console.log('🔧 开始修复数据问题...');
      
      let fixedCount = 0;

      // 修复会话消息计数
      const sessions = await this.prisma.chatSession.findMany({
        include: {
          _count: {
            select: { messages: true }
          }
        }
      });

      for (const session of sessions) {
        if (session.messageCount !== session._count.messages) {
          await this.prisma.chatSession.update({
            where: { id: session.id },
            data: { messageCount: session._count.messages }
          });
          fixedCount++;
        }
      }

      console.log(`✅ 修复了 ${fixedCount} 个数据问题`);
      
      return {
        success: true,
        message: `成功修复 ${fixedCount} 个数据问题`
      };
    } catch (error) {
      console.error('❌ 修复数据问题失败:', error);
      return {
        success: false,
        message: `修复数据问题失败: ${error.message}`
      };
    }
  }

  /**
   * 关闭连接
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// 命令行接口
async function main() {
  const migrator = new DatabaseMigrator();
  const command = process.argv[2];

  try {
    switch (command) {
      case 'migrate':
        const migrateResult = await migrator.runMigrations();
        console.log(migrateResult.message);
        break;

      case 'reset':
        const resetResult = await migrator.resetDatabase();
        console.log(resetResult.message);
        break;

      case 'backup':
        const backupResult = await migrator.backupDatabase();
        console.log(backupResult.message);
        break;

      case 'status':
        const status = await migrator.getDatabaseStatus();
        console.log('数据库状态:', status);
        break;

      case 'check':
        const checkResult = await migrator.checkConnection();
        console.log(checkResult.message);
        break;

      case 'validate':
        const validateResult = await migrator.validateDataIntegrity();
        console.log(validateResult.message);
        if (validateResult.changes?.issues) {
          console.log('发现的问题:', validateResult.changes.issues);
        }
        break;

      case 'fix':
        const fixResult = await migrator.fixDataIssues();
        console.log(fixResult.message);
        break;

      default:
        console.log(`
数据库迁移工具使用说明:

命令:
  migrate    运行数据库迁移
  reset      重置数据库
  backup     备份数据库
  status     获取数据库状态
  check      检查数据库连接
  validate   验证数据完整性
  fix        修复数据问题

示例:
  npm run migrate migrate
  npm run migrate reset
  npm run migrate backup
        `);
    }
  } catch (error) {
    console.error('❌ 操作失败:', error);
    process.exit(1);
  } finally {
    await migrator.disconnect();
  }
}

if (require.main === module) {
  main();
}

export default DatabaseMigrator;
