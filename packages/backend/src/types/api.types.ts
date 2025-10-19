// 从共享包导入基础类型
export * from '../../../shared/src/types';

// ==================== 后端特定类型 ====================

// 请求上下文类型
export interface RequestContext {
  user?: {
    id: string;
    email: string;
    username: string;
  };
  requestId: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

// 文件上传类型
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  destination?: string;
  filename?: string;
  path?: string;
}

// JWT Payload 类型
export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
  type: 'access' | 'refresh';
}

// 数据库查询选项
export interface DatabaseQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
  include?: Record<string, boolean>;
}

// 缓存选项
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string;
  tags?: string[];
}

// 日志上下文
export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  [key: string]: any;
}

// 中间件配置
export interface MiddlewareConfig {
  enabled: boolean;
  options?: Record<string, any>;
}

// 服务配置
export interface ServiceConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  port: number;
  host: string;
  cors: {
    origin: string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  database: {
    url: string;
    maxConnections: number;
  };
  redis: {
    url: string;
    retryDelayOnFailover: number;
  };
  ai: {
    provider: string;
    apiKey: string;
    baseUrl?: string;
    defaultModel: string;
    timeout: number;
  };
}

// 健康检查响应
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
  environment: string;
  services: {
    database: 'connected' | 'disconnected';
    redis: 'connected' | 'disconnected';
    ai: 'available' | 'unavailable';
  };
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

// 系统统计
export interface SystemStats {
  users: {
    total: number;
    active: number;
    newToday: number;
  };
  sessions: {
    total: number;
    active: number;
    createdToday: number;
  };
  messages: {
    total: number;
    sentToday: number;
    averagePerSession: number;
  };
  api: {
    requestsToday: number;
    averageResponseTime: number;
    errorRate: number;
  };
}

// 错误详情
export interface ErrorDetails {
  code: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: Date;
  requestId?: string;
  userId?: string;
}

// 验证规则
export interface ValidationRule {
  field: string;
  rules: Array<{
    type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom';
    value?: any;
    message: string;
  }>;
}

// 分页元数据
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage?: number;
  prevPage?: number;
}

// 扩展的分页响应
export interface ExtendedPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: PaginationMeta;
  timestamp: string;
}

export default {};
