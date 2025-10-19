import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import serve from 'koa-static';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// import { errorHandler } from './middleware/errorHandler';
// import { rateLimitMiddleware } from './middleware/rateLimit';
import { logger as winstonLogger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = new Koa();
const router = new Router();
const prisma = new PrismaClient();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173',
    credentials: true,
  })
);

// Logging
app.use(logger());
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  winstonLogger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// Basic error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      error: err.message || 'Internal Server Error',
    };
  }
});

// Body parsing
app.use(bodyParser());

// Health check endpoint
router.get('/health', async (ctx: any) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    ctx.body = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});

// Test database endpoint
router.get('/test-db', async (ctx: any) => {
  try {
    // Test basic query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Get table counts
    const userCount = await prisma.user.count();
    const sessionCount = await prisma.chatSession.count();
    const messageCount = await prisma.message.count();
    
    ctx.body = {
      success: true,
      message: 'Database connection and queries successful',
      data: {
        queryTest: result,
        tableCounts: {
          users: userCount,
          sessions: sessionCount,
          messages: messageCount
        }
      }
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});

// Import controllers
import authController from './controllers/authController';
import chatController from './controllers/chatController';
import sessionController from './controllers/sessionController';
import userController from './controllers/userController';

// API routes
router.use('/api/auth', authController.routes());
router.use('/api/chat', chatController.routes());
router.use('/api/sessions', sessionController.routes());
router.use('/api/users', userController.routes());

// Apply routes
app.use(router.routes());
app.use(router.allowedMethods());

// Error handling for unhandled routes
app.use(async (ctx) => {
  ctx.status = 404;
  ctx.body = {
    error: 'Not Found',
    message: 'The requested resource was not found',
  };
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(serve('public'));
}

// Graceful shutdown for database
process.on('SIGINT', async () => {
  winstonLogger.info('🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  winstonLogger.info('🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
