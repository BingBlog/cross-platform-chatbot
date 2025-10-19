import { Context, Next } from 'koa';
import { logger } from '../utils/logger';

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err: any) {
    // Log the error
    logger.error('Error occurred:', {
      error: err.message,
      stack: err.stack,
      url: ctx.url,
      method: ctx.method,
      ip: ctx.ip,
    });

    // Set default status
    ctx.status = err.status || err.statusCode || 500;

    // Handle different error types
    if (err.name === 'ValidationError') {
      ctx.status = 400;
      ctx.body = {
        success: false,
        error: 'Validation Error',
        message: err.message,
        details: err.details,
      };
    } else if (err.name === 'UnauthorizedError') {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required',
      };
    } else if (err.name === 'ForbiddenError') {
      ctx.status = 403;
      ctx.body = {
        success: false,
        error: 'Forbidden',
        message: 'Access denied',
      };
    } else if (err.name === 'NotFoundError') {
      ctx.status = 404;
      ctx.body = {
        success: false,
        error: 'Not Found',
        message: err.message || 'Resource not found',
      };
    } else {
      // Generic error response
      ctx.body = {
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      };
    }
  }
};