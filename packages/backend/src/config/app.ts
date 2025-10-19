import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 应用配置
export const appConfig = {
  // 服务器配置
  port: parseInt(process.env.PORT || '3000'),
  host: process.env.HOST || 'localhost',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS 配置
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080'
  ],
  
  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  
  // AI 服务配置
  ai: {
    qwenApiKey: process.env.QWEN_API_KEY || '',
    qwenApiUrl: process.env.QWEN_API_URL || 'https://dashscope.aliyuncs.com/api/v1',
    qwenModel: process.env.QWEN_MODEL || 'qwen-turbo',
    maxTokens: parseInt(process.env.QWEN_MAX_TOKENS || '2048'),
    temperature: parseFloat(process.env.QWEN_TEMPERATURE || '0.7'),
  },
  
  // 文件上传配置
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'text/plain',
      'application/pdf',
    ],
  },
  
  // 限流配置
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15分钟
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  
  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: parseInt(process.env.LOG_MAX_FILES || '5'),
  },
  
  // 邮件配置（可选）
  email: {
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: parseInt(process.env.SMTP_PORT || '587'),
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    fromEmail: process.env.FROM_EMAIL || '',
  },
  
  // 分析配置（可选）
  analytics: {
    enabled: process.env.ANALYTICS_ENABLED === 'true',
    key: process.env.ANALYTICS_KEY || '',
  },
};

// 验证必需的配置
export function validateConfig(): void {
  const requiredEnvVars = [
    'DATABASE_URL',
    'REDIS_URL',
    'JWT_SECRET',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Missing environment variables:', missingVars);
    console.warn('Using default values for development');
  }

  if (appConfig.nodeEnv === 'production') {
    if (!appConfig.ai.qwenApiKey) {
      throw new Error('QWEN_API_KEY is required in production');
    }
  }
}

export default appConfig;
