// Common types used across all platforms

// ==================== 枚举类型 ====================

export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM',
}

export enum ContentType {
  TEXT = 'TEXT',
  MARKDOWN = 'MARKDOWN',
  CODE = 'CODE',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  JSON = 'JSON',
}

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

// ==================== 核心业务类型 ====================

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  loginCount: number;
  preferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  description?: string;
  messageCount: number;
  lastMessageAt?: Date;
  isArchived: boolean;
  isFavorite: boolean;
  isPinned: boolean;
  aiModel?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  sessionId: string;
  userId: string;
  role: MessageRole;
  content: string;
  contentType: ContentType;
  parentMessageId?: string;
  isEdited: boolean;
  editHistory?: Record<string, any>;
  tokenCount?: number;
  processingTime?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageAttachment {
  id: string;
  messageId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  mimeType?: string;
  isProcessed: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  fontSize: number;
  enableNotifications: boolean;
  enableSound: boolean;
  autoSave: boolean;
  defaultAiModel?: string;
  apiSettings?: Record<string, any>;
  uiPreferences?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  sessionToken: string;
  refreshToken?: string;
  deviceInfo?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  expiresAt: Date;
  lastActivityAt: Date;
  createdAt: Date;
}

export interface FavoriteSession {
  id: string;
  userId: string;
  sessionId: string;
  createdAt: Date;
}

export interface SessionTag {
  id: string;
  userId: string;
  sessionId: string;
  tagName: string;
  color?: string;
  createdAt: Date;
}

export interface SearchHistory {
  id: string;
  userId: string;
  sessionId?: string;
  query: string;
  resultCount?: number;
  createdAt: Date;
}

export interface ApiUsage {
  id: string;
  userId: string;
  apiProvider: string;
  model: string;
  requestType: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost?: number;
  responseTime: number;
  success: boolean;
  errorMessage?: string;
  createdAt: Date;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
  processingTime?: number;
}

// ==================== API 请求/响应类型 ====================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

// ==================== 认证相关类型 ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// ==================== 用户相关类型 ====================

export interface UpdateUserRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}

export interface UpdateUserSettingsRequest {
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  fontSize?: number;
  enableNotifications?: boolean;
  enableSound?: boolean;
  autoSave?: boolean;
  defaultAiModel?: string;
  apiSettings?: Record<string, any>;
  uiPreferences?: Record<string, any>;
}

// ==================== 会话相关类型 ====================

export interface CreateSessionRequest {
  title: string;
  description?: string;
  aiModel?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface UpdateSessionRequest {
  title?: string;
  description?: string;
  isArchived?: boolean;
  isFavorite?: boolean;
  isPinned?: boolean;
  aiModel?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface SessionListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isArchived?: boolean;
  isFavorite?: boolean;
  isPinned?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'lastMessageAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface SessionWithMessages extends ChatSession {
  messages: Message[];
  tags: SessionTag[];
}

// ==================== 消息相关类型 ====================

export interface CreateMessageRequest {
  content: string;
  contentType?: ContentType;
  parentMessageId?: string;
  metadata?: Record<string, any>;
}

export interface UpdateMessageRequest {
  content: string;
  metadata?: Record<string, any>;
}

export interface MessageListQuery {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface MessageWithReplies extends Message {
  replies: Message[];
  attachments: MessageAttachment[];
}

// ==================== AI 相关类型 ====================

export interface SendMessageRequest {
  content: string;
  contentType?: ContentType;
  parentMessageId?: string;
  stream?: boolean;
  metadata?: Record<string, any>;
}

export interface StreamMessageResponse {
  id: string;
  content: string;
  isComplete: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
  processingTime?: number;
}

export interface AIProviderConfig {
  provider: string;
  model: string;
  apiKey: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

// ==================== 搜索相关类型 ====================

export interface SearchRequest {
  query: string;
  sessionId?: string;
  page?: number;
  limit?: number;
  filters?: {
    dateRange?: {
      start: Date;
      end: Date;
    };
    contentType?: ContentType[];
    role?: MessageRole[];
  };
}

export interface SearchResult {
  message: Message;
  session: ChatSession;
  score: number;
  highlights: string[];
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  processingTime: number;
}

// ==================== 文件上传相关类型 ====================

export interface FileUploadRequest {
  file: File;
  messageId?: string;
  metadata?: Record<string, any>;
}

export interface FileUploadResponse {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  filePath: string;
  mimeType: string;
  url: string;
}

// ==================== 统计相关类型 ====================

export interface UsageStats {
  totalMessages: number;
  totalSessions: number;
  totalTokens: number;
  totalCost: number;
  averageResponseTime: number;
  mostUsedModel: string;
  dailyUsage: Array<{
    date: string;
    messages: number;
    tokens: number;
    cost: number;
  }>;
}

export interface UserStats {
  user: User;
  stats: UsageStats;
  recentActivity: Array<{
    type: 'message' | 'session' | 'login';
    description: string;
    timestamp: Date;
  }>;
}

// ==================== 分页和查询参数 ====================

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface QueryParams extends PaginationParams {
  search?: string;
  filter?: Record<string, any>;
}

// Platform-specific types
export interface PlatformConfig {
  platform: 'desktop' | 'mobile' | 'web';
  version: string;
  capabilities: string[];
}

export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface NetworkAdapter {
  get<T>(url: string, config?: any): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: any): Promise<ApiResponse<T>>;
}
