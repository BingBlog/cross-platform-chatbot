import { Context, Next } from 'koa';

export const authMiddleware = async (ctx: Context, next: Next) => {
  // TODO: Implement authentication middleware
  await next();
};
