import Router from '@koa/router';
import { Context } from 'koa';
import { logger as winstonLogger } from '../utils/logger';
import { AuthService } from '../services/auth.service';
import { ApiError } from '../types/api.types';
import { RegisterRequest, LoginRequest } from '../types/auth.types';

const router = new Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 用户注册
 *     description: 创建新用户账户
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *               confirmPassword:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     expiresIn:
 *                       type: number
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/register', async (ctx: Context) => {
  try {
    winstonLogger.info('User registration attempt', {
      email: ctx.request.body?.email,
      username: ctx.request.body?.username,
    });

    const registerData: RegisterRequest = ctx.request.body;

    // 验证必需字段
    if (
      !registerData.email ||
      !registerData.username ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      throw new ApiError(
        'MISSING_FIELDS',
        'All fields are required',
        null,
        400
      );
    }

    const result = await AuthService.register(registerData);

    winstonLogger.info('User registered successfully', {
      userId: result.user.id,
      email: result.user.email,
    });

    ctx.status = 201;
    ctx.body = {
      success: true,
      message: 'User registered successfully',
      data: result,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    winstonLogger.error('Registration error:', error);

    if (error instanceof ApiError) {
      ctx.status = error.statusCode;
      ctx.body = error.toApiResponse();
    } else {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 用户登录
 *     description: 用户登录获取访问令牌
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     expiresIn:
 *                       type: number
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/login', async (ctx: Context) => {
  try {
    winstonLogger.info('User login attempt', {
      email: ctx.request.body?.email,
    });

    const loginData: LoginRequest = ctx.request.body;

    // 验证必需字段
    if (!loginData.email || !loginData.password) {
      throw new ApiError(
        'MISSING_FIELDS',
        'Email and password are required',
        null,
        400
      );
    }

    const result = await AuthService.login(loginData);

    winstonLogger.info('User logged in successfully', {
      userId: result.user.id,
      email: result.user.email,
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Login successful',
      data: result,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    winstonLogger.error('Login error:', error);

    if (error instanceof ApiError) {
      ctx.status = error.statusCode;
      ctx.body = error.toApiResponse();
    } else {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 用户登出
 *     description: 用户登出（客户端应删除本地存储的令牌）
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 登出成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/logout', async (ctx: Context) => {
  try {
    winstonLogger.info('User logout', {
      userId: ctx.state.user?.id,
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Logout successful',
      data: null,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    winstonLogger.error('Logout error:', error);
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
 * /api/auth/refresh:
 *   post:
 *     summary: 刷新访问令牌
 *     description: 使用刷新令牌获取新的访问令牌
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: 令牌刷新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     expiresIn:
 *                       type: number
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/refresh', async (ctx: Context) => {
  try {
    const { refreshToken } = ctx.request.body;

    if (!refreshToken) {
      throw new ApiError(
        'MISSING_REFRESH_TOKEN',
        'Refresh token is required',
        null,
        400
      );
    }

    winstonLogger.info('Token refresh attempt');

    const result = await AuthService.refreshToken(refreshToken);

    winstonLogger.info('Token refreshed successfully', {
      userId: result.user.id,
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      message: 'Token refreshed successfully',
      data: result,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    winstonLogger.error('Token refresh error:', error);

    if (error instanceof ApiError) {
      ctx.status = error.statusCode;
      ctx.body = error.toApiResponse();
    } else {
      ctx.status = 500;
      ctx.body = {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }
});

export default router;
