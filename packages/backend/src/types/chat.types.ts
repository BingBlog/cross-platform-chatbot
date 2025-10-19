// 消息角色类型
export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM',
}

// 消息类型
export interface Message {
  id: string;
  sessionId: string;
  userId: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// 聊天会话类型
export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
}

// 发送消息请求
export interface SendMessageRequest {
  sessionId: string;
  content: string;
  metadata?: Record<string, any>;
}

// 创建会话请求
export interface CreateSessionRequest {
  title: string;
}

// 更新会话请求
export interface UpdateSessionRequest {
  title?: string;
}

// 聊天响应
export interface ChatResponse {
  message: Message;
  session: ChatSession;
}

// 流式响应类型
export interface StreamResponse {
  type: 'content' | 'metadata' | 'error' | 'done';
  data: any;
  messageId?: string;
  sessionId?: string;
}

// AI 配置类型
export interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

// 聊天上下文类型
export interface ChatContext {
  sessionId: string;
  userId: string;
  messages: Message[];
  config: AIConfig;
  metadata?: Record<string, any>;
}

// 消息搜索类型
export interface MessageSearch {
  query: string;
  sessionId?: string;
  userId?: string;
  role?: MessageRole;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

// 会话统计类型
export interface SessionStats {
  totalSessions: number;
  totalMessages: number;
  averageMessagesPerSession: number;
  mostActiveSession?: ChatSession;
  recentSessions: ChatSession[];
}

export default {};
