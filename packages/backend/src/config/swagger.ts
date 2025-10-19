import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Cross-Platform AI Chatbot API',
    version: '1.0.0',
    description:
      'API documentation for the Cross-Platform AI Chatbot supporting desktop, mobile, and web clients',
    contact: {
      name: 'API Support',
      email: 'support@chatbot.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3001/api',
      description: 'Development server',
    },
    {
      url: 'https://api.chatbot.com/api',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token for authentication',
      },
    },
    schemas: {
      // Common schemas
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indicates if the request was successful',
          },
          message: {
            type: 'string',
            description: 'Response message',
          },
          data: {
            type: 'object',
            description: 'Response data',
          },
          error: {
            type: 'string',
            description: 'Error message if any',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
          },
        },
        required: ['success', 'message', 'timestamp'],
      },
      PaginatedResponse: {
        allOf: [
          { $ref: '#/components/schemas/ApiResponse' },
          {
            type: 'object',
            properties: {
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'integer', minimum: 1 },
                  limit: { type: 'integer', minimum: 1, maximum: 100 },
                  total: { type: 'integer', minimum: 0 },
                  totalPages: { type: 'integer', minimum: 0 },
                },
                required: ['page', 'limit', 'total', 'totalPages'],
              },
            },
            required: ['pagination'],
          },
        ],
      },
      ValidationError: {
        type: 'object',
        properties: {
          field: { type: 'string' },
          message: { type: 'string' },
          value: { type: 'string' },
        },
        required: ['field', 'message'],
      },
      // User schemas
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'cuid' },
          email: { type: 'string', format: 'email' },
          username: { type: 'string', minLength: 3, maxLength: 50 },
          avatar: { type: 'string', format: 'uri' },
          firstName: { type: 'string', maxLength: 50 },
          lastName: { type: 'string', maxLength: 50 },
          bio: { type: 'string', maxLength: 500 },
          isActive: { type: 'boolean' },
          isEmailVerified: { type: 'boolean' },
          emailVerifiedAt: { type: 'string', format: 'date-time' },
          lastLoginAt: { type: 'string', format: 'date-time' },
          loginCount: { type: 'integer', minimum: 0 },
          preferences: { type: 'object' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: [
          'id',
          'email',
          'username',
          'isActive',
          'isEmailVerified',
          'createdAt',
          'updatedAt',
        ],
      },
      CreateUserRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          username: { type: 'string', minLength: 3, maxLength: 50 },
          password: { type: 'string', minLength: 8, maxLength: 128 },
          firstName: { type: 'string', maxLength: 50 },
          lastName: { type: 'string', maxLength: 50 },
        },
        required: ['email', 'username', 'password'],
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
        required: ['email', 'password'],
      },
      LoginResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          token: { type: 'string' },
          refreshToken: { type: 'string' },
          expiresIn: { type: 'integer' },
        },
        required: ['user', 'token', 'expiresIn'],
      },
      // Chat Session schemas
      ChatSession: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'cuid' },
          userId: { type: 'string', format: 'cuid' },
          title: { type: 'string', maxLength: 200 },
          description: { type: 'string', maxLength: 1000 },
          messageCount: { type: 'integer', minimum: 0 },
          lastMessageAt: { type: 'string', format: 'date-time' },
          isArchived: { type: 'boolean' },
          isFavorite: { type: 'boolean' },
          isPinned: { type: 'boolean' },
          aiModel: { type: 'string' },
          systemPrompt: { type: 'string' },
          temperature: { type: 'number', minimum: 0, maximum: 2 },
          maxTokens: { type: 'integer', minimum: 1, maximum: 4000 },
          metadata: { type: 'object' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: [
          'id',
          'userId',
          'title',
          'messageCount',
          'isArchived',
          'isFavorite',
          'isPinned',
          'createdAt',
          'updatedAt',
        ],
      },
      CreateSessionRequest: {
        type: 'object',
        properties: {
          title: { type: 'string', maxLength: 200 },
          description: { type: 'string', maxLength: 1000 },
          aiModel: { type: 'string' },
          systemPrompt: { type: 'string' },
          temperature: { type: 'number', minimum: 0, maximum: 2 },
          maxTokens: { type: 'integer', minimum: 1, maximum: 4000 },
        },
        required: ['title'],
      },
      UpdateSessionRequest: {
        type: 'object',
        properties: {
          title: { type: 'string', maxLength: 200 },
          description: { type: 'string', maxLength: 1000 },
          isArchived: { type: 'boolean' },
          isFavorite: { type: 'boolean' },
          isPinned: { type: 'boolean' },
          aiModel: { type: 'string' },
          systemPrompt: { type: 'string' },
          temperature: { type: 'number', minimum: 0, maximum: 2 },
          maxTokens: { type: 'integer', minimum: 1, maximum: 4000 },
        },
      },
      // Message schemas
      Message: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'cuid' },
          sessionId: { type: 'string', format: 'cuid' },
          userId: { type: 'string', format: 'cuid' },
          role: {
            type: 'string',
            enum: ['USER', 'ASSISTANT', 'SYSTEM'],
            description: 'Message role',
          },
          content: { type: 'string' },
          contentType: {
            type: 'string',
            enum: ['TEXT', 'MARKDOWN', 'CODE', 'IMAGE', 'FILE', 'JSON'],
            description: 'Content type',
          },
          parentMessageId: { type: 'string', format: 'cuid' },
          isEdited: { type: 'boolean' },
          editHistory: { type: 'object' },
          tokenCount: { type: 'integer', minimum: 0 },
          processingTime: { type: 'integer', minimum: 0 },
          metadata: { type: 'object' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: [
          'id',
          'sessionId',
          'userId',
          'role',
          'content',
          'contentType',
          'isEdited',
          'createdAt',
          'updatedAt',
        ],
      },
      CreateMessageRequest: {
        type: 'object',
        properties: {
          content: { type: 'string', minLength: 1, maxLength: 10000 },
          contentType: {
            type: 'string',
            enum: ['TEXT', 'MARKDOWN', 'CODE', 'IMAGE', 'FILE', 'JSON'],
            default: 'TEXT',
          },
          parentMessageId: { type: 'string', format: 'cuid' },
          metadata: { type: 'object' },
        },
        required: ['content'],
      },
      // AI Response schemas
      AIResponse: {
        type: 'object',
        properties: {
          content: { type: 'string' },
          usage: {
            type: 'object',
            properties: {
              promptTokens: { type: 'integer', minimum: 0 },
              completionTokens: { type: 'integer', minimum: 0 },
              totalTokens: { type: 'integer', minimum: 0 },
            },
          },
          model: { type: 'string' },
          processingTime: { type: 'integer', minimum: 0 },
        },
        required: ['content'],
      },
      // User Settings schemas
      UserSettings: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'cuid' },
          userId: { type: 'string', format: 'cuid' },
          theme: { type: 'string', enum: ['light', 'dark', 'auto'] },
          language: { type: 'string' },
          fontSize: { type: 'integer', minimum: 12, maximum: 24 },
          enableNotifications: { type: 'boolean' },
          enableSound: { type: 'boolean' },
          autoSave: { type: 'boolean' },
          defaultAiModel: { type: 'string' },
          apiSettings: { type: 'object' },
          uiPreferences: { type: 'object' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: [
          'id',
          'userId',
          'theme',
          'language',
          'fontSize',
          'enableNotifications',
          'enableSound',
          'autoSave',
          'createdAt',
          'updatedAt',
        ],
      },
      UpdateUserSettingsRequest: {
        type: 'object',
        properties: {
          theme: { type: 'string', enum: ['light', 'dark', 'auto'] },
          language: { type: 'string' },
          fontSize: { type: 'integer', minimum: 12, maximum: 24 },
          enableNotifications: { type: 'boolean' },
          enableSound: { type: 'boolean' },
          autoSave: { type: 'boolean' },
          defaultAiModel: { type: 'string' },
          apiSettings: { type: 'object' },
          uiPreferences: { type: 'object' },
        },
      },
    },
    responses: {
      BadRequest: {
        description: 'Bad request - validation error',
        content: {
          'application/json': {
            schema: {
              allOf: [
                { $ref: '#/components/schemas/ApiResponse' },
                {
                  type: 'object',
                  properties: {
                    errors: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/ValidationError' },
                    },
                  },
                },
              ],
            },
          },
        },
      },
      Unauthorized: {
        description: 'Unauthorized - authentication required',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiResponse' },
          },
        },
      },
      Forbidden: {
        description: 'Forbidden - insufficient permissions',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiResponse' },
          },
        },
      },
      NotFound: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiResponse' },
          },
        },
      },
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ApiResponse' },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization',
    },
    {
      name: 'Users',
      description: 'User management operations',
    },
    {
      name: 'Chat Sessions',
      description: 'Chat session management',
    },
    {
      name: 'Messages',
      description: 'Message operations',
    },
    {
      name: 'AI',
      description: 'AI integration and responses',
    },
    {
      name: 'Settings',
      description: 'User settings and preferences',
    },
    {
      name: 'System',
      description: 'System health and monitoring',
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/controllers/*.ts',
    './src/routes/*.ts',
    './src/middleware/*.ts',
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
