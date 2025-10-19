# API Documentation Guide

This document explains how to use the OpenAPI 3.0 + Swagger UI documentation system for the Cross-Platform AI Chatbot API.

## Overview

The API documentation system provides:
- **OpenAPI 3.0 Specification**: Complete API specification in JSON format
- **Swagger UI**: Interactive API documentation interface
- **TypeScript Type Generation**: Auto-generated types from OpenAPI spec
- **Cross-Platform Support**: Types available for all platforms (web, mobile, desktop)

## Quick Start

### 1. Start the Development Server

```bash
# Start the backend server
pnpm dev

# Or use the docs-specific command
pnpm docs:serve
```

### 2. Access API Documentation

- **Swagger UI**: http://localhost:3001/api/docs
- **OpenAPI JSON**: http://localhost:3001/api/api-docs
- **Health Check**: http://localhost:3001/api/health

### 3. Generate TypeScript Types

```bash
# Generate types from OpenAPI specification
pnpm docs:generate
```

This will create:
- `src/types/generated/api.types.ts` - Backend types
- `../../shared/src/types/generated/api.types.ts` - Shared types

## API Documentation Structure

### Base URL
- Development: `http://localhost:3001/api`
- Production: `https://api.chatbot.com/api`

### Authentication
All protected endpoints require a Bearer token:
```
Authorization: Bearer <your-jwt-token>
```

### Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "message": string,
  "data": object | null,
  "error": string | null,
  "timestamp": string (ISO 8601)
}
```

### Pagination
Paginated responses include:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/settings` - Get user settings
- `PUT /api/users/settings` - Update user settings

### Chat Sessions
- `GET /api/sessions` - List user sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get session details
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### Messages
- `GET /api/sessions/:id/messages` - Get session messages
- `POST /api/sessions/:id/messages` - Send message
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message

### AI Integration
- `POST /api/chat/send` - Send message to AI
- `POST /api/chat/stream` - Stream AI response

## Adding New API Endpoints

### 1. Create Controller with Swagger Comments

```typescript
/**
 * @swagger
 * /api/example/hello:
 *   get:
 *     summary: Hello World endpoint
 *     description: A simple example endpoint
 *     tags: [System]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name to greet
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 */
router.get('/hello', async (ctx) => {
  // Implementation
});
```

### 2. Add Route to App

```typescript
// In src/app.ts
import exampleController from './controllers/exampleController';
router.use('/api/example', exampleController.routes());
```

### 3. Update Swagger Schema (if needed)

Add new schemas to `src/config/swagger.ts`:

```typescript
components: {
  schemas: {
    NewSchema: {
      type: 'object',
      properties: {
        // Define properties
      }
    }
  }
}
```

### 4. Regenerate Types

```bash
pnpm docs:generate
```

## Testing APIs

### Using Swagger UI
1. Go to http://localhost:3001/api/docs
2. Click "Authorize" and enter your JWT token
3. Try out endpoints directly in the browser

### Using curl
```bash
# Get API docs
curl http://localhost:3001/api/api-docs

# Test health endpoint
curl http://localhost:3001/api/health

# Test with authentication
curl -H "Authorization: Bearer <token>" \
     http://localhost:3001/api/users/profile
```

### Using Postman
1. Import the OpenAPI spec from http://localhost:3001/api/api-docs
2. Set up environment variables for base URL and auth token
3. Create collections for different API groups

## TypeScript Integration

### Backend Usage
```typescript
import { ApiResponse, User, CreateUserRequest } from './types/generated';

async function createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
  // Implementation
}
```

### Frontend Usage (Shared Package)
```typescript
import { ApiResponse, User, CreateUserRequest } from '@chatbot/shared/types/generated';

// Use in React components
const [user, setUser] = useState<User | null>(null);
```

## Best Practices

### 1. Documentation
- Always add Swagger comments to new endpoints
- Use descriptive summaries and descriptions
- Include example values for parameters
- Document all possible response codes

### 2. Error Handling
- Use consistent error response format
- Include helpful error messages
- Log errors for debugging
- Return appropriate HTTP status codes

### 3. Validation
- Validate all input parameters
- Use Joi or similar for request validation
- Return detailed validation errors
- Sanitize user inputs

### 4. Security
- Protect sensitive endpoints with authentication
- Use HTTPS in production
- Validate JWT tokens
- Implement rate limiting

### 5. Performance
- Use pagination for list endpoints
- Implement caching where appropriate
- Monitor API response times
- Use database indexes for queries

## Troubleshooting

### Common Issues

1. **Swagger UI not loading**
   - Check if server is running on correct port
   - Verify CORS settings
   - Check browser console for errors

2. **Types not generating**
   - Ensure OpenAPI spec is valid JSON
   - Check file paths in generate-types.ts
   - Verify openapi-typescript is installed

3. **Authentication not working**
   - Verify JWT token format
   - Check token expiration
   - Ensure Authorization header is set correctly

### Debug Commands

```bash
# Check if server is running
curl http://localhost:3001/api/health

# Validate OpenAPI spec
npx swagger-jsdoc --help

# Test type generation
npx openapi-typescript --help
```

## Resources

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [openapi-typescript Documentation](https://github.com/drwpow/openapi-typescript)
