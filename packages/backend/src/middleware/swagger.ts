import Koa from 'koa';
import Router from '@koa/router';
import { koaSwagger } from 'koa2-swagger-ui';
import { swaggerSpec } from '../config/swagger';
import { logger } from '../utils/logger';

/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: Get API documentation
 *     description: Returns the OpenAPI specification in JSON format
 *     tags: [System]
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export const swaggerRouter = new Router();

// Serve OpenAPI specification
swaggerRouter.get('/api-docs', async (ctx: Koa.Context) => {
  try {
    ctx.set('Content-Type', 'application/json');
    ctx.body = swaggerSpec;
  } catch (error) {
    logger.error('Error serving API docs:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Failed to load API documentation',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
});

// Serve Swagger UI
swaggerRouter.get(
  '/docs',
  koaSwagger({
    routePrefix: '/docs',
    swaggerOptions: {
      url: '/api/api-docs',
    },
  })
);

// Health check endpoint
swaggerRouter.get('/health', async (ctx: Koa.Context) => {
  ctx.body = {
    success: true,
    message: 'API is healthy',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    },
    timestamp: new Date().toISOString(),
  };
});

export default swaggerRouter;
