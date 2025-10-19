# Testing Guidelines

## Overview

This document provides essential testing guidelines for the Cross-Platform AI Chatbot project, focusing on core testing principles and best practices.

## Testing Strategy

### Test Pyramid
- **Unit Tests (70%)**: Business logic, utilities, components
- **Integration Tests (20%)**: API endpoints, service interactions
- **E2E Tests (10%)**: Complete user workflows

### Coverage Targets
- **Unit Tests**: >90% coverage for business logic
- **Integration Tests**: >80% coverage for API endpoints
- **Overall Project**: >80% total coverage

## Testing Framework Setup

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 }
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts']
};
```

### Testing Library Setup
```typescript
// src/__tests__/setup.ts
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });
global.fetch = jest.fn();
```

## Unit Testing

### Business Logic Testing
```typescript
// packages/shared/src/business/__tests__/chatService.test.ts
describe('ChatService', () => {
  let chatService: ChatService;
  let mockAIService: jest.Mocked<AIService>;

  beforeEach(() => {
    mockAIService = { generateResponse: jest.fn() } as any;
    chatService = new ChatService(mockAIService, mockSessionService);
  });

  it('should send message and return AI response', async () => {
    const mockResponse = { content: 'Hello!', role: 'ASSISTANT' };
    mockAIService.generateResponse.mockResolvedValue(mockResponse);

    const result = await chatService.sendMessage('Hello', 'session-123');
    
    expect(result).toEqual(mockResponse);
    expect(mockAIService.generateResponse).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    mockAIService.generateResponse.mockRejectedValue(new Error('AI unavailable'));
    
    await expect(chatService.sendMessage('Hello', 'session-123'))
      .rejects.toThrow('AI unavailable');
  });
});
```

### Utility Function Testing
```typescript
// packages/shared/src/utils/__tests__/dateUtils.test.ts
describe('dateUtils', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-12-19T10:30:00Z');
    expect(formatDate(date)).toBe('2024-12-19');
  });

  it('should handle invalid dates', () => {
    expect(() => formatDate(new Date('invalid'))).toThrow('Invalid date');
  });

  it('should return true for today\'s date', () => {
    const today = new Date();
    expect(isToday(today)).toBe(true);
  });
});
```

### Component Testing (React)
```typescript
// packages/shared/src/components/__tests__/MessageBubble.test.tsx
describe('MessageBubble', () => {
  const mockMessage = {
    id: 'msg-123',
    content: 'Hello, how are you?',
    role: 'USER',
    sessionId: 'session-123',
    userId: 'user-123',
    createdAt: new Date('2024-12-19T10:30:00Z')
  };

  it('should render user message correctly', () => {
    render(<MessageBubble message={mockMessage} />);
    
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
    expect(screen.getByTestId('message-bubble')).toHaveClass('user-message');
  });

  it('should handle copy message action', () => {
    const mockOnCopy = jest.fn();
    render(<MessageBubble message={mockMessage} onCopy={mockOnCopy} />);
    
    fireEvent.click(screen.getByTestId('copy-button'));
    expect(mockOnCopy).toHaveBeenCalledWith(mockMessage.content);
  });
});
```

## Integration Testing

### API Endpoint Testing
```typescript
// packages/backend/src/__tests__/auth.integration.test.ts
describe('Auth API Integration', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
    await redis.flushall();
  });

  it('should register a new user successfully', async () => {
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

  it('should return validation error for invalid data', async () => {
    const invalidData = {
      email: 'invalid-email',
      username: 'ab',
      password: '123',
      confirmPassword: '456'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(invalidData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.code).toBe('VALIDATION_ERROR');
  });
});
```

## End-to-End Testing

### E2E Test Example
```typescript
// packages/web/src/__tests__/e2e/chat.e2e.test.ts
import { test, expect } from '@playwright/test';

test.describe('Chat Application E2E', () => {
  test('should send message and receive AI response', async ({ page }) => {
    await page.goto('/');
    
    // Login
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Send message
    await page.fill('[data-testid="message-input"]', 'Hello, how are you?');
    await page.click('[data-testid="send-button"]');
    
    // Verify response
    await expect(page.locator('[data-testid="assistant-message"]').last()).toBeVisible();
  });
});
```

## Testing Best Practices

### Test Organization
- Use `__tests__` directories for test files
- Co-locate tests with source files when possible
- Use descriptive test names that explain the behavior
- Group related tests with `describe` blocks

### Mocking Strategy
- Mock external dependencies (APIs, databases, file system)
- Use dependency injection for testability
- Mock at the boundary of your system
- Keep mocks simple and focused

### Test Data
- Use factories for creating test data
- Keep test data minimal and focused
- Use realistic but not production data
- Clean up test data after each test

### Assertions
- Test behavior, not implementation
- Use specific assertions over generic ones
- Test error conditions and edge cases
- Verify side effects (database changes, API calls)

### Performance
- Keep tests fast and isolated
- Use parallel test execution when possible
- Avoid unnecessary setup and teardown
- Mock slow operations (network, file I/O)

Remember: Good tests are readable, maintainable, and provide confidence in your code. Focus on testing the most important behaviors and edge cases.