import helmet from 'koa-helmet';

/**
 * Content Security Policy middleware
 * Provides different CSP configurations for development and production
 */
export const cspMiddleware = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // Development CSP - more permissive for Swagger UI
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://fonts.googleapis.com',
            'https://cdnjs.cloudflare.com',
          ],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://cdnjs.cloudflare.com',
          ],
          fontSrc: [
            "'self'",
            'https://fonts.gstatic.com',
            'https://cdnjs.cloudflare.com',
          ],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'http://localhost:*', 'https://localhost:*'],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          manifestSrc: ["'self'"],
        },
      },
    });
  } else {
    // Production CSP - strict security
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          fontSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'", 'http://localhost:*', 'https://localhost:*'],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          manifestSrc: ["'self'"],
        },
      },
    });
  }
};

export default cspMiddleware;
