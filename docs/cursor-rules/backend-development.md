# Backend Development Guidelines

## Overview

This document provides essential backend development guidelines for the Cross-Platform AI Chatbot project, complementing the main `.cursorrules` file.

## Architecture Pattern

### Controller → Service → Model Pattern

Follow the layered architecture pattern for all backend development:

```typescript
// Controller Layer - Handle HTTP requests/responses
export class AuthController {
  constructor(private authService: AuthService) {}
  
  async register(ctx: Context) {
    try {
      const result = await this.authService.register(ctx.request.body);
      ctx.body = { success: true, data: result };
    } catch (error) {
      ctx.status = error.status || 500;
      ctx.body = { success: false, error: error.message };
    }
  }
}

// Service Layer - Business logic
export class AuthService {
  constructor(private userModel: UserModel, private jwtService: JwtService) {}
  
  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Business logic implementation
  }
}

// Model Layer - Data access
export class UserModel {
  async create(data: CreateUserData): Promise<User> {
    // Database operations
  }
}
```

## Entity-Based Development

### Core Entities
- **Authentication Entity**: User registration, login, JWT management
- **User Entity**: Profile management, preferences, statistics
- **Chat Entity**: Message processing, AI integration, history management
- **Session Entity**: Chat session lifecycle, statistics, sharing

### File Structure
```
controllers/
├── authController.ts
├── userController.ts
├── chatController.ts
└── sessionController.ts

services/
├── auth.service.ts
├── user.service.ts
├── chat.service.ts
└── session.service.ts
```

## Service Development Standards

### Dependency Injection
Use constructor injection for all service dependencies:
```typescript
export class ChatService {
  constructor(
    private aiService: AIService,
    private sessionService: SessionService,
    private messageRepository: MessageRepository,
    private cacheService: CacheService
  ) {}
}
```

### Error Handling
Use the `ApiError` class for consistent error handling:
```typescript
import { ApiError } from '../types/api.types';

export class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const user = await this.userModel.findByEmail(data.email);
    
    if (!user) {
      throw new ApiError('INVALID_CREDENTIALS', 'Invalid email or password', null, 401);
    }
    
    // Continue with login logic...
  }
}
```

### Input Validation
Validate all inputs at the service level using Joi:
```typescript
import Joi from 'joi';

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
});
```

## API Design Standards

### RESTful Endpoints
Follow RESTful conventions for all API endpoints:
```typescript
// Authentication endpoints
POST   /api/auth/register     // User registration
POST   /api/auth/login        // User login
POST   /api/auth/logout       // User logout
POST   /api/auth/refresh      // Token refresh

// User endpoints
GET    /api/user/profile      // Get user profile
PUT    /api/user/profile      // Update user profile
POST   /api/user/avatar       // Upload avatar

// Chat endpoints
POST   /api/chat/message      // Send message
GET    /api/chat/history/:id  // Get chat history
GET    /api/chat/search       // Search messages

// Session endpoints
GET    /api/sessions          // List sessions
POST   /api/sessions          // Create session
PUT    /api/sessions/:id      // Update session
DELETE /api/sessions/:id      // Delete session
```

### Response Format
Use consistent response format for all endpoints:
```typescript
// Success response
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully",
  "timestamp": "2024-12-19T10:30:00Z"
}

// Error response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-12-19T10:30:00Z"
}
```

### HTTP Status Codes
- `200` - Success, `201` - Created, `400` - Bad Request, `401` - Unauthorized
- `403` - Forbidden, `404` - Not Found, `409` - Conflict, `422` - Unprocessable Entity, `500` - Internal Server Error

## Swagger Documentation

### Controller Documentation
Document all endpoints with Swagger decorators:
```typescript
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, username, password, confirmPassword]
 *             properties:
 *               email: { type: string, format: email }
 *               username: { type: string, minLength: 3, maxLength: 30 }
 *               password: { type: string, minLength: 6 }
 *               confirmPassword: { type: string }
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
```

### Schema Definitions
Define reusable schemas in Swagger:
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id: { type: string, example: "clx1234567890" }
 *         email: { type: string, format: email }
 *         username: { type: string }
 *         avatar: { type: string, nullable: true }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *     
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user: { $ref: '#/components/schemas/User' }
 *         accessToken: { type: string }
 *         refreshToken: { type: string }
 *         expiresIn: { type: number }
 */
```

## Middleware Development

### Authentication Middleware
```typescript
export const authMiddleware = async (ctx: Context, next: Next) => {
  const token = ctx.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    ctx.status = 401;
    ctx.body = { success: false, error: 'Authentication token required', code: 'MISSING_TOKEN' };
    return;
  }
  
  try {
    const payload = await AuthService.verifyToken(token);
    ctx.state.user = payload;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { success: false, error: 'Invalid or expired token', code: 'INVALID_TOKEN' };
  }
};
```

### Validation Middleware
```typescript
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return async (ctx: Context, next: Next) => {
    const { error, value } = schema.validate(ctx.request.body);
    
    if (error) {
      ctx.status = 400;
      ctx.body = { success: false, error: error.details[0].message, code: 'VALIDATION_ERROR' };
      return;
    }
    
    ctx.request.body = value;
    await next();
  };
};
```

### Rate Limiting Middleware
```typescript
import rateLimit from 'koa-ratelimit';

export const rateLimitMiddleware = rateLimit({
  driver: 'redis',
  db: redis,
  duration: 60000, // 1 minute
  max: 100, // requests per duration
  id: (ctx) => ctx.ip,
  errorMessage: 'Too many requests'
});
```

## Database Integration

### Prisma Model Usage
```typescript
import { PrismaClient } from '@prisma/client';

export class UserModel {
  constructor(private prisma: PrismaClient) {}
  
  async create(data: CreateUserData): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: await this.hashPassword(data.password)
      }
    });
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }
  
  async updateProfile(id: string, data: UpdateProfileData): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: { username: data.username, avatar: data.avatar, updatedAt: new Date() }
    });
  }
}
```

### Repository Pattern
```typescript
export interface MessageRepository {
  create(data: CreateMessageData): Promise<Message>;
  findBySessionId(sessionId: string, limit?: number, offset?: number): Promise<Message[]>;
  search(query: string, sessionId?: string): Promise<Message[]>;
  delete(id: string): Promise<void>;
}

export class PrismaMessageRepository implements MessageRepository {
  constructor(private prisma: PrismaClient) {}
  
  async create(data: CreateMessageData): Promise<Message> {
    return await this.prisma.message.create({
      data: { content: data.content, role: data.role, sessionId: data.sessionId, userId: data.userId }
    });
  }
}
```

## Caching Strategy

### Redis Integration
```typescript
import Redis from 'ioredis';

export class CacheService {
  constructor(private redis: Redis) {}
  
  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }
  
  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
  
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
  
  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```

### Cache Usage Examples
```typescript
export class ChatService {
  constructor(
    private messageRepository: MessageRepository,
    private cacheService: CacheService
  ) {}
  
  async getChatHistory(sessionId: string): Promise<Message[]> {
    const cacheKey = `chat:history:${sessionId}`;
    
    // Try to get from cache first
    let messages = await this.cacheService.get<Message[]>(cacheKey);
    
    if (!messages) {
      // Fetch from database
      messages = await this.messageRepository.findBySessionId(sessionId);
      
      // Cache for 1 hour
      await this.cacheService.set(cacheKey, messages, 3600);
    }
    
    return messages;
  }
  
  async sendMessage(data: SendMessageData): Promise<Message> {
    const message = await this.messageRepository.create(data);
    
    // Invalidate cache
    await this.cacheService.invalidatePattern(`chat:history:${data.sessionId}`);
    
    return message;
  }
}
```

## Testing Standards

### Unit Testing
```typescript
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/user.model';
import { JwtService } from '../services/jwt.service';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserModel: jest.Mocked<UserModel>;
  let mockJwtService: jest.Mocked<JwtService>;
  
  beforeEach(() => {
    mockUserModel = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      validatePassword: jest.fn()
    } as any;
    
    mockJwtService = {
      generateTokens: jest.fn(),
      verifyToken: jest.fn()
    } as any;
    
    authService = new AuthService(mockUserModel, mockJwtService);
  });
  
  it('should register a new user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123'
    };
    
    const mockUser = { id: '1', email: userData.email, username: userData.username };
    const mockTokens = { accessToken: 'token', refreshToken: 'refresh', expiresIn: 3600 };
    
    mockUserModel.findByEmail.mockResolvedValue(null);
    mockUserModel.create.mockResolvedValue(mockUser);
    mockJwtService.generateTokens.mockReturnValue(mockTokens);
    
    const result = await authService.register(userData);
    
    expect(result.user).toEqual(mockUser);
    expect(result.accessToken).toBe('token');
    expect(mockUserModel.create).toHaveBeenCalledWith(userData);
  });
});
```

### Integration Testing
```typescript
import request from 'supertest';
import { app } from '../app';

describe('Auth API', () => {
  it('should register a new user', async () => {
    const userData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123'
    };
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userData.email);
    expect(response.body.data.accessToken).toBeDefined();
  });
});
```

## Performance Optimization

### Database Query Optimization
```typescript
// Use select to limit fields
const users = await prisma.user.findMany({
  select: { id: true, username: true, email: true }
});

// Use pagination for large datasets
const messages = await prisma.message.findMany({
  where: { sessionId },
  take: 50, // limit
  skip: offset,
  orderBy: { createdAt: 'desc' }
});

// Use include for related data
const sessionWithMessages = await prisma.session.findUnique({
  where: { id: sessionId },
  include: { messages: { take: 10, orderBy: { createdAt: 'desc' } } }
});
```

### Connection Pooling
```typescript
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
  __internal: {
    engine: { connectTimeout: 60000, queryTimeout: 60000 }
  }
});
```

## Security Best Practices

### Input Sanitization
```typescript
import DOMPurify from 'isomorphic-dompurify';

export class MessageService {
  async createMessage(data: CreateMessageData): Promise<Message> {
    const sanitizedContent = DOMPurify.sanitize(data.content);
    return await this.messageRepository.create({ ...data, content: sanitizedContent });
  }
}
```

### SQL Injection Prevention
Always use Prisma's parameterized queries:
```typescript
// ✅ Good - Parameterized query
const user = await prisma.user.findUnique({ where: { email: userEmail } });

// ❌ Bad - String concatenation (never do this)
const user = await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userEmail}`;
```

### Rate Limiting
```typescript
export const authRateLimit = rateLimit({ max: 5, duration: 60000 });
export const chatRateLimit = rateLimit({ max: 100, duration: 60000 });
```

## Monitoring and Logging

### Structured Logging
```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});
```

### Performance Monitoring
```typescript
export const performanceMiddleware = async (ctx: Context, next: Next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  
  logger.info('Request completed', {
    method: ctx.method,
    url: ctx.url,
    status: ctx.status,
    duration: `${duration}ms`
  });
  
  if (duration > 1000) {
    logger.warn('Slow request detected', { method: ctx.method, url: ctx.url, duration: `${duration}ms` });
  }
};
```

Remember: These guidelines should be followed consistently across all backend development. They ensure code quality, maintainability, and security while providing a solid foundation for the AI chatbot backend system.
