import Router from '@koa/router';
import { logger } from '../utils/logger';

const router = new Router();

/**
 * @swagger
 * /api/example/hello:
 *   get:
 *     summary: Hello World endpoint
 *     description: A simple example endpoint that returns a greeting message
 *     tags: [System]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name to greet
 *         example: "World"
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
 *                           example: "Hello, World!"
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/hello', async (ctx: any) => {
  try {
    const { name = 'World' } = ctx.query;

    logger.info(`Hello endpoint called with name: ${name}`);

    ctx.body = {
      success: true,
      message: 'Hello endpoint executed successfully',
      data: {
        message: `Hello, ${name}!`,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Hello endpoint error:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
});

/**
 * @swagger
 * /api/example/echo:
 *   post:
 *     summary: Echo endpoint
 *     description: Echoes back the sent data
 *     tags: [System]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: Message to echo back
 *                 example: "Hello from the client!"
 *               data:
 *                 type: object
 *                 description: Additional data to echo back
 *                 example: { key: "value" }
 *             required:
 *               - message
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
 *                         echo:
 *                           type: object
 *                           description: Echoed data
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/echo', async (ctx: any) => {
  try {
    const { message, data } = ctx.request.body;

    if (!message) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Validation error',
        error: 'Message is required',
        timestamp: new Date().toISOString(),
      };
      return;
    }

    logger.info(`Echo endpoint called with message: ${message}`);

    ctx.body = {
      success: true,
      message: 'Echo endpoint executed successfully',
      data: {
        echo: {
          message,
          data,
          timestamp: new Date().toISOString(),
        },
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Echo endpoint error:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
});

export default router;
