import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { promptRoutes } from './routes/prompt.routes';
import { healthRoutes } from './routes/health.routes';
import { statsRoutes } from './routes/stats.routes';
import { logger } from './utils/logger';
import { initializeServices, shutdownServices } from './init';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debug: Log environment variables (remove in production)
console.log('🔍 Environment check:');
console.log('- OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Not set');
console.log('- ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? '✅ Set' : '❌ Not set');
console.log('- PAYMENT_RECIPIENT_ADDRESS:', process.env.PAYMENT_RECIPIENT_ADDRESS || '❌ Not set');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use('/v1/prompt', promptRoutes);
app.use('/health', healthRoutes);
app.use('/v1/stats', statsRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  try {
    await initializeServices();
    
    app.listen(PORT, () => {
      logger.info(`🚀 StacksAI Gateway running on port ${PORT}`);
      logger.info(`📡 Network: ${process.env.STACKS_NETWORK || 'testnet'}`);
      logger.info(`💰 Payment recipient: ${process.env.PAYMENT_RECIPIENT_ADDRESS}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received');
  await shutdownServices();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received');
  await shutdownServices();
  process.exit(0);
});

start();
