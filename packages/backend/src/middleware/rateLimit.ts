import { Context, Next } from 'koa';

export const rateLimitMiddleware = async (ctx: Context, next: Next) => {
  // TODO: Implement rate limiting middleware
  await next();
};
