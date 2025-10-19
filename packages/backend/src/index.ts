import dotenv from 'dotenv';
import app from './app';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🗄️  Database: ${process.env.DATABASE_URL ? 'configured' : 'not configured'}`);
  logger.info(`🔴 Redis: ${process.env.REDIS_URL ? 'configured' : 'not configured'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('🛑 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('🛑 Shutting down server...');
  process.exit(0);
});
