# AI Integration Guidelines

## Overview

This document provides detailed AI integration guidelines for the Cross-Platform AI Chatbot project, focusing on QWEN API integration, streaming responses, and conversation management.

## QWEN API Integration

### Client Configuration

```typescript
// packages/shared/src/ai/qwenClient.ts
export class QwenClient {
  private apiKey: string;
  private baseURL: string;
  private defaultConfig: QwenConfig;

  constructor(apiKey: string, baseURL: string = 'https://dashscope.aliyuncs.com/api/v1') {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
    this.defaultConfig = {
      model: 'qwen-turbo',
      temperature: 0.7,
      maxTokens: 2000,
      topP: 0.8,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0
    };
  }

  async generateResponse(
    messages: Message[],
    options?: Partial<QwenConfig>
  ): Promise<AsyncIterable<string>> {
    const config = { ...this.defaultConfig, ...options };
    
    const response = await fetch(`${this.baseURL}/services/aigc/text-generation/generation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-SSE': 'enable' // Enable streaming
      },
      body: JSON.stringify({
        model: config.model,
        input: {
          messages: this.formatMessages(messages)
        },
        parameters: {
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          top_p: config.topP,
          frequency_penalty: config.frequencyPenalty,
          presence_penalty: config.presencePenalty,
          stream: true
        }
      })
    });

    if (!response.ok) {
      throw new QwenError(`API request failed: ${response.status}`, response.status);
    }

    return this.parseStreamResponse(response);
  }

  private formatMessages(messages: Message[]): QwenMessage[] {
    return messages.map(msg => ({
      role: msg.role === 'USER' ? 'user' : 'assistant',
      content: msg.content
    }));
  }

  private async *parseStreamResponse(response: Response): AsyncIterable<string> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new QwenError('No response body reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.output?.choices?.[0]?.delta?.content) {
                yield parsed.output.choices[0].delta.content;
              }
            } catch (e) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
```

### Configuration Types

```typescript
// packages/shared/src/ai/types.ts
export interface QwenConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface QwenMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface QwenError extends Error {
  status?: number;
  code?: string;
}

export interface StreamResponse {
  type: 'content' | 'metadata' | 'error' | 'done';
  data: any;
  messageId?: string;
  sessionId?: string;
}
```

## Streaming Response Implementation

### Backend Streaming Service

```typescript
// packages/backend/src/services/ai.service.ts
export class AIService {
  constructor(
    private qwenClient: QwenClient,
    private messageRepository: MessageRepository,
    private cacheService: CacheService
  ) {}

  async processMessage(
    content: string,
    sessionId: string,
    userId: string,
    options?: Partial<QwenConfig>
  ): Promise<AsyncIterable<StreamResponse>> {
    // Get conversation context
    const context = await this.getConversationContext(sessionId);
    
    // Add user message to context
    const userMessage: Message = {
      id: generateId(),
      sessionId,
      userId,
      role: MessageRole.USER,
      content,
      createdAt: new Date()
    };

    // Save user message
    await this.messageRepository.create(userMessage);
    context.messages.push(userMessage);

    // Generate AI response
    const aiResponseId = generateId();
    let aiContent = '';

    try {
      const stream = await this.qwenClient.generateResponse(context.messages, options);
      
      for await (const chunk of stream) {
        aiContent += chunk;
        
        yield {
          type: 'content',
          data: chunk,
          messageId: aiResponseId,
          sessionId
        };
      }

      // Save complete AI response
      const aiMessage: Message = {
        id: aiResponseId,
        sessionId,
        userId,
        role: MessageRole.ASSISTANT,
        content: aiContent,
        createdAt: new Date()
      };

      await this.messageRepository.create(aiMessage);

      // Update session
      await this.updateSessionLastMessage(sessionId, aiMessage);

      yield {
        type: 'done',
        data: { messageId: aiResponseId },
        messageId: aiResponseId,
        sessionId
      };

    } catch (error) {
      logger.error('AI response generation failed', { error, sessionId, userId });
      
      yield {
        type: 'error',
        data: { error: 'Failed to generate response' },
        sessionId
      };
    }
  }

  private async getConversationContext(sessionId: string): Promise<ChatContext> {
    const cacheKey = `chat:context:${sessionId}`;
    
    // Try to get from cache first
    let context = await this.cacheService.get<ChatContext>(cacheKey);
    
    if (!context) {
      // Fetch from database
      const messages = await this.messageRepository.findBySessionId(sessionId, 20); // Last 20 messages
      
      context = {
        sessionId,
        userId: messages[0]?.userId || '',
        messages,
        config: this.getDefaultAIConfig(),
        metadata: {}
      };
      
      // Cache for 1 hour
      await this.cacheService.set(cacheKey, context, 3600);
    }
    
    return context;
  }

  private getDefaultAIConfig(): AIConfig {
    return {
      model: 'qwen-turbo',
      temperature: 0.7,
      maxTokens: 2000,
      topP: 0.8,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0
    };
  }
}
```

### Frontend Streaming Handler

```typescript
// packages/shared/src/ai/streamHandler.ts
export class StreamHandler {
  private eventSource: EventSource | null = null;
  private onContent?: (content: string) => void;
  private onComplete?: (messageId: string) => void;
  private onError?: (error: string) => void;

  async startStream(
    sessionId: string,
    content: string,
    callbacks: {
      onContent?: (content: string) => void;
      onComplete?: (messageId: string) => void;
      onError?: (error: string) => void;
    }
  ): Promise<void> {
    this.onContent = callbacks.onContent;
    this.onComplete = callbacks.onComplete;
    this.onError = callbacks.onError;

    const url = new URL('/api/chat/stream', window.location.origin);
    url.searchParams.set('sessionId', sessionId);

    this.eventSource = new EventSource(url.toString());

    this.eventSource.onmessage = (event) => {
      try {
        const data: StreamResponse = JSON.parse(event.data);
        
        switch (data.type) {
          case 'content':
            this.onContent?.(data.data);
            break;
          case 'done':
            this.onComplete?.(data.data.messageId);
            this.close();
            break;
          case 'error':
            this.onError?.(data.data.error);
            this.close();
            break;
        }
      } catch (error) {
        this.onError?.('Failed to parse stream data');
        this.close();
      }
    };

    this.eventSource.onerror = () => {
      this.onError?.('Stream connection failed');
      this.close();
    };

    // Send the message to start the stream
    await fetch('/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({ sessionId, content })
    });
  }

  close(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  private getAuthToken(): string {
    // Get token from storage or state
    return localStorage.getItem('authToken') || '';
  }
}
```

## Conversation Context Management

### Context Manager

```typescript
// packages/shared/src/ai/contextManager.ts
export class ContextManager {
  constructor(
    private messageRepository: MessageRepository,
    private cacheService: CacheService
  ) {}

  async getContext(sessionId: string, maxMessages: number = 20): Promise<Message[]> {
    const cacheKey = `context:${sessionId}:${maxMessages}`;
    
    // Try cache first
    let messages = await this.cacheService.get<Message[]>(cacheKey);
    
    if (!messages) {
      messages = await this.messageRepository.findBySessionId(sessionId, maxMessages);
      
      // Cache for 30 minutes
      await this.cacheService.set(cacheKey, messages, 1800);
    }
    
    return messages;
  }

  async addMessage(sessionId: string, message: Message): Promise<void> {
    // Invalidate context cache
    await this.cacheService.invalidatePattern(`context:${sessionId}:*`);
    
    // Add to database
    await this.messageRepository.create(message);
  }

  async clearContext(sessionId: string): Promise<void> {
    // Clear cache
    await this.cacheService.invalidatePattern(`context:${sessionId}:*`);
    
    // Optionally clear database messages
    // await this.messageRepository.deleteBySessionId(sessionId);
  }

  async getContextSummary(sessionId: string): Promise<string> {
    const messages = await this.getContext(sessionId, 50);
    
    if (messages.length === 0) {
      return 'No previous conversation context.';
    }

    // Create a summary of the conversation
    const summary = messages
      .slice(-10) // Last 10 messages
      .map(msg => `${msg.role}: ${msg.content.substring(0, 100)}...`)
      .join('\n');

    return `Recent conversation context:\n${summary}`;
  }
}
```

### Memory Management

```typescript
// packages/shared/src/ai/memoryManager.ts
export class MemoryManager {
  private memoryLimit: number = 100; // Maximum messages to keep in memory
  private summaryThreshold: number = 50; // When to create summaries

  async manageMemory(sessionId: string): Promise<void> {
    const messageCount = await this.messageRepository.countBySessionId(sessionId);
    
    if (messageCount > this.memoryLimit) {
      await this.createSummary(sessionId);
      await this.archiveOldMessages(sessionId);
    }
  }

  private async createSummary(sessionId: string): Promise<void> {
    const oldMessages = await this.messageRepository.findBySessionId(
      sessionId, 
      this.summaryThreshold,
      0 // offset
    );

    if (oldMessages.length === 0) return;

    // Create summary using AI
    const summaryPrompt = this.createSummaryPrompt(oldMessages);
    const summary = await this.generateSummary(summaryPrompt);

    // Save summary as a system message
    const summaryMessage: Message = {
      id: generateId(),
      sessionId,
      userId: oldMessages[0].userId,
      role: MessageRole.SYSTEM,
      content: `Conversation Summary: ${summary}`,
      createdAt: new Date(),
      metadata: { type: 'summary', originalCount: oldMessages.length }
    };

    await this.messageRepository.create(summaryMessage);
  }

  private createSummaryPrompt(messages: Message[]): string {
    const conversation = messages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    return `Please create a concise summary of the following conversation:\n\n${conversation}\n\nSummary:`;
  }

  private async generateSummary(prompt: string): Promise<string> {
    // Use a smaller, faster model for summarization
    const response = await this.qwenClient.generateResponse(
      [{ role: 'user', content: prompt }],
      { model: 'qwen-turbo', maxTokens: 500, temperature: 0.3 }
    );

    let summary = '';
    for await (const chunk of response) {
      summary += chunk;
    }

    return summary;
  }

  private async archiveOldMessages(sessionId: string): Promise<void> {
    // Archive messages older than the summary threshold
    await this.messageRepository.archiveOldMessages(sessionId, this.summaryThreshold);
  }
}
```

## Error Handling and Retry Logic

### Retry Mechanism

```typescript
// packages/shared/src/ai/retryHandler.ts
export class RetryHandler {
  private maxRetries: number = 3;
  private baseDelay: number = 1000; // 1 second

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (this.isRetryableError(error) && attempt < this.maxRetries) {
          const delay = this.calculateDelay(attempt);
          logger.warn(`Retry attempt ${attempt} for ${context}`, { 
            error: error.message, 
            delay 
          });
          
          await this.sleep(delay);
          continue;
        }
        
        throw error;
      }
    }

    throw lastError!;
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors, rate limits, and server errors
    if (error instanceof QwenError) {
      return error.status === 429 || // Rate limit
             error.status >= 500 ||  // Server error
             error.code === 'NETWORK_ERROR';
    }
    
    return false;
  }

  private calculateDelay(attempt: number): number {
    // Exponential backoff with jitter
    const exponentialDelay = this.baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 0.1 * exponentialDelay;
    return exponentialDelay + jitter;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Error Types and Handling

```typescript
// packages/shared/src/ai/errors.ts
export class QwenError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'QwenError';
  }
}

export class ContextError extends Error {
  constructor(message: string, public sessionId?: string) {
    super(message);
    this.name = 'ContextError';
  }
}

export class StreamError extends Error {
  constructor(message: string, public streamId?: string) {
    super(message);
    this.name = 'StreamError';
  }
}

// Error handler
export class AIErrorHandler {
  static handle(error: Error): { message: string; code: string; status: number } {
    if (error instanceof QwenError) {
      return {
        message: this.getQwenErrorMessage(error),
        code: error.code || 'QWEN_API_ERROR',
        status: error.status || 500
      };
    }

    if (error instanceof ContextError) {
      return {
        message: 'Failed to manage conversation context',
        code: 'CONTEXT_ERROR',
        status: 500
      };
    }

    if (error instanceof StreamError) {
      return {
        message: 'Streaming response failed',
        code: 'STREAM_ERROR',
        status: 500
      };
    }

    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      status: 500
    };
  }

  private static getQwenErrorMessage(error: QwenError): string {
    switch (error.status) {
      case 400:
        return 'Invalid request to AI service';
      case 401:
        return 'AI service authentication failed';
      case 429:
        return 'AI service rate limit exceeded';
      case 500:
        return 'AI service temporarily unavailable';
      default:
        return 'AI service error occurred';
    }
  }
}
```

## Rate Limiting and Caching

### Rate Limiting

```typescript
// packages/backend/src/middleware/aiRateLimit.ts
export const aiRateLimitMiddleware = rateLimit({
  driver: 'redis',
  db: redis,
  duration: 60000, // 1 minute
  max: 30, // 30 requests per minute per user
  id: (ctx) => `ai:${ctx.state.user?.id || ctx.ip}`,
  errorMessage: 'AI request rate limit exceeded',
  headers: {
    remaining: 'X-AI-Rate-Limit-Remaining',
    reset: 'X-AI-Rate-Limit-Reset',
    total: 'X-AI-Rate-Limit-Total'
  }
});

// Different limits for different AI operations
export const aiStreamRateLimit = rateLimit({
  driver: 'redis',
  db: redis,
  duration: 60000,
  max: 10, // 10 streaming requests per minute
  id: (ctx) => `ai:stream:${ctx.state.user?.id || ctx.ip}`,
  errorMessage: 'AI streaming rate limit exceeded'
});
```

### Response Caching

```typescript
// packages/backend/src/services/aiCache.service.ts
export class AICacheService {
  constructor(private cacheService: CacheService) {}

  async getCachedResponse(
    messages: Message[],
    config: QwenConfig
  ): Promise<string | null> {
    const cacheKey = this.generateCacheKey(messages, config);
    return await this.cacheService.get<string>(cacheKey);
  }

  async setCachedResponse(
    messages: Message[],
    config: QwenConfig,
    response: string,
    ttl: number = 3600
  ): Promise<void> {
    const cacheKey = this.generateCacheKey(messages, config);
    await this.cacheService.set(cacheKey, response, ttl);
  }

  private generateCacheKey(messages: Message[], config: QwenConfig): string {
    const messageHash = this.hashMessages(messages);
    const configHash = this.hashConfig(config);
    return `ai:response:${messageHash}:${configHash}`;
  }

  private hashMessages(messages: Message[]): string {
    const content = messages
      .map(msg => `${msg.role}:${msg.content}`)
      .join('|');
    return this.simpleHash(content);
  }

  private hashConfig(config: QwenConfig): string {
    const configStr = `${config.model}:${config.temperature}:${config.maxTokens}`;
    return this.simpleHash(configStr);
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}
```

## Multi-Model Support

### Model Manager

```typescript
// packages/shared/src/ai/modelManager.ts
export class ModelManager {
  private models: Map<string, QwenClient> = new Map();

  constructor() {
    this.initializeModels();
  }

  private initializeModels(): void {
    const apiKey = process.env.QWEN_API_KEY;
    
    // Different models for different use cases
    this.models.set('qwen-turbo', new QwenClient(apiKey, 'qwen-turbo'));
    this.models.set('qwen-plus', new QwenClient(apiKey, 'qwen-plus'));
    this.models.set('qwen-max', new QwenClient(apiKey, 'qwen-max'));
  }

  getModel(modelName: string): QwenClient {
    const model = this.models.get(modelName);
    if (!model) {
      throw new Error(`Model ${modelName} not found`);
    }
    return model;
  }

  getAvailableModels(): string[] {
    return Array.from(this.models.keys());
  }

  async selectOptimalModel(
    messages: Message[],
    requirements: {
      maxTokens?: number;
      quality?: 'fast' | 'balanced' | 'high';
      cost?: 'low' | 'medium' | 'high';
    }
  ): Promise<string> {
    const messageLength = messages.reduce((sum, msg) => sum + msg.content.length, 0);
    
    // Simple model selection logic
    if (requirements.quality === 'high' || messageLength > 4000) {
      return 'qwen-max';
    } else if (requirements.quality === 'balanced' || messageLength > 2000) {
      return 'qwen-plus';
    } else {
      return 'qwen-turbo';
    }
  }
}
```

## Testing AI Integration

### Unit Tests

```typescript
// packages/backend/src/services/__tests__/ai.service.test.ts
describe('AIService', () => {
  let aiService: AIService;
  let mockQwenClient: jest.Mocked<QwenClient>;
  let mockMessageRepository: jest.Mocked<MessageRepository>;

  beforeEach(() => {
    mockQwenClient = {
      generateResponse: jest.fn()
    } as any;
    
    mockMessageRepository = {
      create: jest.fn(),
      findBySessionId: jest.fn()
    } as any;

    aiService = new AIService(mockQwenClient, mockMessageRepository, mockCacheService);
  });

  describe('processMessage', () => {
    it('should process message and return streaming response', async () => {
      const messages = [
        { id: '1', role: 'USER', content: 'Hello', sessionId: 'session1', userId: 'user1', createdAt: new Date() }
      ];
      
      mockMessageRepository.findBySessionId.mockResolvedValue(messages);
      mockMessageRepository.create.mockResolvedValue({} as Message);
      
      const mockStream = async function* () {
        yield 'Hello';
        yield ' there!';
        yield ' How can I help you?';
      };
      
      mockQwenClient.generateResponse.mockResolvedValue(mockStream());

      const responses: StreamResponse[] = [];
      for await (const response of aiService.processMessage('Hello', 'session1', 'user1')) {
        responses.push(response);
      }

      expect(responses).toHaveLength(4); // 3 content + 1 done
      expect(responses[0].type).toBe('content');
      expect(responses[0].data).toBe('Hello');
      expect(responses[3].type).toBe('done');
    });

    it('should handle AI service errors gracefully', async () => {
      mockMessageRepository.findBySessionId.mockResolvedValue([]);
      mockQwenClient.generateResponse.mockRejectedValue(new QwenError('API Error', 500));

      const responses: StreamResponse[] = [];
      for await (const response of aiService.processMessage('Hello', 'session1', 'user1')) {
        responses.push(response);
      }

      expect(responses).toHaveLength(1);
      expect(responses[0].type).toBe('error');
      expect(responses[0].data.error).toBe('Failed to generate response');
    });
  });
});
```

### Integration Tests

```typescript
// packages/backend/src/__tests__/ai.integration.test.ts
describe('AI Integration', () => {
  let app: Koa;
  let authToken: string;

  beforeAll(async () => {
    app = createApp();
    authToken = await getTestAuthToken();
  });

  describe('POST /api/chat/message', () => {
    it('should process message and return AI response', async () => {
      const response = await request(app)
        .post('/api/chat/message')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId: 'test-session',
          content: 'Hello, how are you?'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.messageId).toBeDefined();
      expect(response.body.data.content).toBeDefined();
    });

    it('should handle streaming responses', async () => {
      const response = await request(app)
        .post('/api/chat/stream')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          sessionId: 'test-session',
          content: 'Tell me a story'
        })
        .expect(200);

      expect(response.headers['content-type']).toContain('text/event-stream');
    });
  });
});
```

## Performance Optimization

### Connection Pooling

```typescript
// packages/backend/src/config/ai.config.ts
export const aiConfig = {
  qwen: {
    apiKey: process.env.QWEN_API_KEY,
    baseURL: 'https://dashscope.aliyuncs.com/api/v1',
    timeout: 30000,
    maxRetries: 3,
    retryDelay: 1000,
    connectionPool: {
      maxConnections: 10,
      keepAlive: true,
      keepAliveMsecs: 30000
    }
  },
  caching: {
    enabled: true,
    ttl: 3600, // 1 hour
    maxSize: 1000 // Maximum cached responses
  },
  rateLimiting: {
    requestsPerMinute: 30,
    burstLimit: 10
  }
};
```

### Response Optimization

```typescript
// packages/shared/src/ai/responseOptimizer.ts
export class ResponseOptimizer {
  static optimizeResponse(content: string): string {
    // Remove excessive whitespace
    content = content.replace(/\s+/g, ' ').trim();
    
    // Remove duplicate content
    content = this.removeDuplicates(content);
    
    // Truncate if too long
    if (content.length > 4000) {
      content = content.substring(0, 4000) + '...';
    }
    
    return content;
  }

  private static removeDuplicates(content: string): string {
    const sentences = content.split(/[.!?]+/);
    const uniqueSentences = [...new Set(sentences)];
    return uniqueSentences.join('. ').trim();
  }
}
```

Remember: AI integration is a critical component of the chatbot system. These guidelines ensure reliable, performant, and maintainable AI functionality while providing excellent user experience through streaming responses and proper error handling.
