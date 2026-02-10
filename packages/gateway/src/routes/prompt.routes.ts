import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import { X402Middleware } from '../middleware/x402.middleware';
import { AIRouterService } from '../services/ai/ai-router.service';
import { logger } from '../utils/logger';

const router: ExpressRouter = Router();
const x402 = new X402Middleware();

// Lazy initialization - create AIRouter when first needed, after env vars are loaded
let aiRouter: AIRouterService | null = null;
function getAIRouter(): AIRouterService {
  if (!aiRouter) {
    aiRouter = new AIRouterService();
  }
  return aiRouter;
}

router.post('/:model', async (req, res, next) => {
  const { model } = req.params;
  
  const middleware = x402.requirePayment({
    scheme: 'exact',
    asset: 'STX',
    modelType: model
  });
  
  return middleware(req, res, next);
}, async (req, res) => {
  try {
    const { model } = req.params;
    const { prompt, maxTokens, temperature } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    logger.info(`Processing prompt for model: ${model}`);

    const response = await getAIRouter().routePrompt(model, prompt, {
      maxTokens,
      temperature
    });

    res.json({
      ...response,
      payment: req.paymentInfo
    });

  } catch (error: any) {
    logger.error('Prompt processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process prompt',
      message: error.message 
    });
  }
});

router.get('/models', async (req, res) => {
  const { PricingService } = await import('../config/pricing');
  const pricing = new PricingService();
  
  res.json({
    models: pricing.getAllPricing()
  });
});

export { router as promptRoutes };
