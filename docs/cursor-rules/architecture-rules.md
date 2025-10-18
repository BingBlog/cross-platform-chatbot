# Architecture Rules

## Overview

This document provides detailed architectural guidelines for the Cross-Platform AI Chatbot project, complementing the main `.cursorrules` file.

## 6-Layer Architecture

### Layer 1: Client (Platform-Specific)

- **Desktop**: Electron renderer process
- **Mobile**: React Native components
- **Web**: React web components

**Responsibilities:**

- Platform-specific UI rendering
- Platform-specific user interactions
- Platform-specific system integrations

### Layer 2: Platform Adapter

- **Purpose**: Bridge platform differences
- **Location**: `packages/shared/adapters/`
- **Pattern**: Adapter pattern for platform-specific implementations

**Key Adapters:**

- `StorageAdapter` - File system, AsyncStorage, localStorage
- `NetworkAdapter` - HTTP client differences
- `NotificationAdapter` - System notifications
- `NavigationAdapter` - Routing differences

### Layer 3: Shared Code (80%+ Reuse)

- **Location**: `packages/shared/`
- **Goal**: Maximum code reuse across platforms
- **Pattern**: Business logic abstraction

**Structure:**

```
shared/
├── business/        # Core business logic
├── models/          # Data models and types
├── api/             # API client and services
├── ai/              # AI integration layer
├── state/           # State management
├── components/      # Platform-agnostic UI components
├── utils/           # Utility functions
└── adapters/        # Platform adapters
```

### Layer 4: Backend Services

- **Technology**: Node.js + Koa.js + TypeScript
- **Pattern**: Microservices architecture
- **Location**: `packages/backend/`

**Services:**

- Authentication service
- Chat service
- AI integration service
- User management service
- Analytics service

### Layer 5: Data Layer

- **Primary**: PostgreSQL 15+
- **Cache**: Redis 7+
- **ORM**: Prisma 5.0+
- **Pattern**: Repository pattern

### Layer 6: External Services

- **AI**: QWEN API
- **Analytics**: Custom analytics
- **Storage**: Cloud storage (if needed)

## Architectural Principles

### 1. Separation of Concerns

- Each layer has a single responsibility
- Dependencies flow downward only
- No circular dependencies

### 2. Dependency Injection

- Use dependency injection for testability
- Abstract external dependencies
- Mock dependencies in tests

### 3. Interface Segregation

- Define small, focused interfaces
- Implement only what's needed
- Avoid fat interfaces

### 4. Open/Closed Principle

- Open for extension, closed for modification
- Use composition over inheritance
- Plugin architecture for extensibility

## Code Organization Patterns

### Feature-Based Organization

```
packages/shared/
├── features/
│   ├── chat/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── auth/
│   └── settings/
```

### Layer-Based Organization

```
packages/shared/
├── business/
├── data/
├── presentation/
└── infrastructure/
```

## Data Flow Architecture

### Unidirectional Data Flow

1. User action → Component
2. Component → Action/Service
3. Service → State Management
4. State → Component re-render

### State Management Flow

```
Component → Zustand Store → API Service → Backend → Database
                ↓
         React Query Cache
```

## Error Handling Architecture

### Error Boundaries

- React error boundaries for UI errors
- Service error handling for API errors
- Global error handler for unhandled errors

### Error Types

- **User Errors**: Validation, authentication
- **System Errors**: Network, server, database
- **AI Errors**: Model failures, rate limits

## Performance Architecture

### Code Splitting

- Route-based splitting
- Component-based splitting
- Dynamic imports for heavy modules

### Caching Strategy

- React Query for server state
- Zustand for client state
- Redis for backend caching
- Browser cache for static assets

## Security Architecture

### Authentication Flow

1. User login → JWT token
2. Token storage → Secure storage
3. API requests → Token in headers
4. Token refresh → Automatic renewal

### Data Protection

- Input validation at all layers
- SQL injection prevention
- XSS protection
- CSRF protection

## Testing Architecture

### Test Pyramid

- **Unit Tests**: Business logic, utilities
- **Integration Tests**: API services, state management
- **E2E Tests**: Complete user workflows

### Test Organization

```
__tests__/
├── unit/
├── integration/
├── e2e/
└── fixtures/
```

## Deployment Architecture

### Development

- Local development with hot reload
- Mock services for external dependencies
- Development database

### Staging

- Production-like environment
- Real external services
- Performance testing

### Production

- Containerized deployment
- Load balancing
- Monitoring and logging

## Monitoring Architecture

### Application Monitoring

- Performance metrics
- Error tracking
- User analytics
- AI model performance

### Infrastructure Monitoring

- Server health
- Database performance
- Network latency
- Resource usage

## Scalability Considerations

### Horizontal Scaling

- Stateless services
- Load balancer ready
- Database sharding strategy

### Vertical Scaling

- Efficient algorithms
- Memory optimization
- CPU optimization

## Migration Strategy

### Database Migrations

- Prisma migrations
- Version control
- Rollback strategy

### API Versioning

- Semantic versioning
- Backward compatibility
- Deprecation strategy

## Documentation Requirements

### Code Documentation

- JSDoc for functions
- README for modules
- Architecture decision records (ADRs)

### API Documentation

- OpenAPI/Swagger specs
- Example requests/responses
- Error code documentation

Remember: Architecture should evolve with the project. Document decisions and be ready to refactor when needed.
