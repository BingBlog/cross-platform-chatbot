import { Context, Next } from 'koa';

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = {
      success: false,
      error: err.message || 'Internal Server Error',
    };
  }
};
