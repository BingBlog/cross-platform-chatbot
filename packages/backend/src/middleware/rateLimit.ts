import { Context, Next } from 'koa';
import Redis from 'ioredis';
import { logger } from '../utils/logger';

// Simple in-memory rate limiting for development
// In production, use Redis-based rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimitMiddleware = async (ctx: Context, next: Next) => {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
  
  const key = ctx.ip;
  const now = Date.now();
  
  // Get or create request count for this IP
  let requestData = requestCounts.get(key);
  
  if (!requestData || now > requestData.resetTime) {
    // Reset or create new window
    requestData = {
      count: 1,
      resetTime: now + windowMs,
    };
    requestCounts.set(key, requestData);
  } else {
    // Increment count
    requestData.count++;
  }
  
  // Check if limit exceeded
  if (requestData.count > maxRequests) {
    logger.warn(`Rate limit exceeded for IP: ${key}`, {
      ip: key,
      count: requestData.count,
      maxRequests,
      windowMs,
    });
    
    ctx.status = 429;
    ctx.body = {
      success: false,
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Max ${maxRequests} requests per ${windowMs / 1000} seconds`,
      retryAfter: Math.ceil((requestData.resetTime - now) / 1000),
    };
    return;
  }
  
  // Add rate limit headers
  ctx.set('X-RateLimit-Limit', maxRequests.toString());
  ctx.set('X-RateLimit-Remaining', Math.max(0, maxRequests - requestData.count).toString());
  ctx.set('X-RateLimit-Reset', new Date(requestData.resetTime).toISOString());
  
  await next();
};

// Redis-based rate limiting for production
export const createRedisRateLimitMiddleware = (redis: Redis) => {
  return async (ctx: Context, next: Next) => {
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000');
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
    
    const key = `rate_limit:${ctx.ip}`;
    const now = Date.now();
    const window = Math.floor(now / windowMs);
    const windowKey = `${key}:${window}`;
    
    try {
      // Increment counter
      const count = await redis.incr(windowKey);
      
      // Set expiration if this is the first request in the window
      if (count === 1) {
        await redis.expire(windowKey, Math.ceil(windowMs / 1000));
      }
      
      // Check if limit exceeded
      if (count > maxRequests) {
        logger.warn(`Rate limit exceeded for IP: ${ctx.ip}`, {
          ip: ctx.ip,
          count,
          maxRequests,
          windowMs,
        });
        
        ctx.status = 429;
        ctx.body = {
          success: false,
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Max ${maxRequests} requests per ${windowMs / 1000} seconds`,
          retryAfter: Math.ceil(windowMs / 1000),
        };
        return;
      }
      
      // Add rate limit headers
      ctx.set('X-RateLimit-Limit', maxRequests.toString());
      ctx.set('X-RateLimit-Remaining', Math.max(0, maxRequests - count).toString());
      ctx.set('X-RateLimit-Reset', new Date((window + 1) * windowMs).toISOString());
      
      await next();
    } catch (error) {
      logger.error('Redis rate limiting error:', error);
      // Fall back to allowing the request if Redis is unavailable
      await next();
    }
  };
};