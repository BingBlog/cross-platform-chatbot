# Backend Service

AI Chatbot Backend built with Node.js, Koa.js, TypeScript, and PostgreSQL.

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+ (optional)
- pnpm

### Development Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment configuration:**
   ```bash
   # Copy environment template
   cp ../env.example .env
   
   # Update .env with your database credentials
   # DATABASE_URL="postgresql://username:password@localhost:5432/chatbot_db"
   ```

3. **Database setup:**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Push database schema
   pnpm db:push
   ```

4. **Start development server:**
   ```bash
   # Option 1: Use the dev script
   ./scripts/dev.sh
   
   # Option 2: Use pnpm directly
   pnpm dev
   ```

### Available Endpoints

- `GET /health` - Health check with database connection test
- `GET /test-db` - Database connection and query test
- `POST /api/auth/register` - User registration (placeholder)
- `POST /api/auth/login` - User login (placeholder)
- `GET /api/sessions` - Get chat sessions (placeholder)
- `POST /api/chat/message` - Send chat message (placeholder)

### Development Commands

```bash
# Development
pnpm dev              # Start development server with hot reload
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes to database
pnpm db:migrate       # Run database migrations
pnpm db:studio        # Open Prisma Studio

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format code with Prettier
pnpm type-check       # TypeScript type checking

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
```

### Project Structure

```
src/
├── app.ts              # Koa application configuration
├── index.ts            # Server entry point
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/             # Database models
├── services/           # Business logic services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Environment Variables

See `../env.example` for all available environment variables.

### Current Status

✅ **Completed:**
- Basic Koa.js server setup
- TypeScript configuration
- Database connection with Prisma
- Health check endpoints
- Basic middleware (CORS, logging, error handling)
- Development environment setup
- ESLint and Prettier configuration

🚧 **In Progress:**
- Authentication system
- Chat functionality
- AI integration
- User management

### Next Steps

1. Implement authentication system
2. Add AI service integration
3. Implement chat functionality
4. Add user management features
5. Add comprehensive testing
