import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export const authMiddleware = async (ctx: Context, next: Next) => {
  try {
    const token = ctx.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: 'No token provided',
        message: 'Authorization header is required',
      };
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Attach user info to context
    ctx.state.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
    };

    await next();
  } catch (err: any) {
    logger.error('Authentication error:', err);
    
    if (err.name === 'JsonWebTokenError') {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: 'Invalid token',
        message: 'Token is malformed or invalid',
      };
    } else if (err.name === 'TokenExpiredError') {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: 'Token expired',
        message: 'Please login again',
      };
    } else {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: 'Authentication failed',
        message: 'Unable to authenticate user',
      };
    }
  }
};

// Optional auth middleware (doesn't fail if no token)
export const optionalAuthMiddleware = async (ctx: Context, next: Next) => {
  try {
    const token = ctx.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      ctx.state.user = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
      };
    }
    
    await next();
  } catch {
    // Continue without authentication
    await next();
  }
};