import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  STACKS_NETWORK: z.enum(['mainnet', 'testnet']).default('testnet'),
  PAYMENT_RECIPIENT_ADDRESS: z.string(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  REDIS_URL: z.string().default('redis://localhost:6379'),
});

export const env = envSchema.parse(process.env);
