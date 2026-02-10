export const PRICING_MODEL = {
  'gpt4': {
    basePrice: 100000,
    usdEquivalent: 0.20,
    maxTokens: 2000,
    description: 'GPT-4 Turbo - Most capable model'
  },
  'claude': {
    basePrice: 120000,
    usdEquivalent: 0.24,
    maxTokens: 2000,
    description: 'Claude 3 Opus - Advanced reasoning'
  },
  'gpt-3.5': {
    basePrice: 20000,
    usdEquivalent: 0.04,
    maxTokens: 1500,
    description: 'GPT-3.5 Turbo - Fast and efficient'
  },
  'gemini': {
    basePrice: 50000,
    usdEquivalent: 0.10,
    maxTokens: 2000,
    description: 'Gemini Pro - Google AI'
  }
} as const;

export type ModelType = keyof typeof PRICING_MODEL;

export class PricingService {
  getPrice(model: string) {
    const pricing = PRICING_MODEL[model as ModelType];
    if (!pricing) {
      throw new Error(`Unknown model: ${model}`);
    }
    return pricing;
  }

  getAllPricing() {
    return PRICING_MODEL;
  }
}
