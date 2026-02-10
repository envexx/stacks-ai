import { nonceManager } from './services/cache/nonce-manager';
import { logger } from './utils/logger';

export async function initializeServices() {
  logger.info('🚀 Initializing StacksAI Gateway services...');

  try {
    await nonceManager.initialize();
    logger.info('✅ All services initialized successfully');
  } catch (error) {
    logger.error('❌ Failed to initialize services:', error);
    throw error;
  }
}

export async function shutdownServices() {
  logger.info('🛑 Shutting down services...');
  
  try {
    await nonceManager.cleanup();
    logger.info('✅ Services shut down successfully');
  } catch (error) {
    logger.error('❌ Error during shutdown:', error);
  }
}
