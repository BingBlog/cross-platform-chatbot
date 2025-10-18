import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from 'koa-cors';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import serve from 'koa-static';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { logger as winstonLogger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = new Koa();
const router = new Router();

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

// Error handling
app.use(errorHandler);

// Rate limiting
app.use(rateLimitMiddleware);

// Body parsing
app.use(bodyParser());

// Health check endpoint
router.get('/health', async ctx => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  };
});

// API routes
router.use(
  '/api/auth',
  require('./controllers/authController').default.routes()
);
router.use(
  '/api/chat',
  authMiddleware,
  require('./controllers/chatController').default.routes()
);
router.use(
  '/api/sessions',
  authMiddleware,
  require('./controllers/sessionController').default.routes()
);
router.use(
  '/api/users',
  authMiddleware,
  require('./controllers/userController').default.routes()
);

// Apply routes
app.use(router.routes());
app.use(router.allowedMethods());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(serve('public'));
}

// Error handling for unhandled routes
app.use(async ctx => {
  ctx.status = 404;
  ctx.body = {
    error: 'Not Found',
    message: 'The requested resource was not found',
  };
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  winstonLogger.info(`Server running on port ${PORT}`);
  winstonLogger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
