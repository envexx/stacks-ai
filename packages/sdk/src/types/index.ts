export interface ClientConfig {
  gatewayUrl?: string;
  network?: 'mainnet' | 'testnet';
}

export interface PromptOptions {
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface AIResponse {
  model: string;
  response: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  payment?: {
    txId: string;
    amount: number;
    sender: string;
    timestamp: number;
  };
  latency: number;
  timestamp: string;
}

export interface PaymentInfo {
  amount: number;
  currency: string;
  recipient: string;
  network: string;
  resource: string;
  nonce: string;
  estimatedCost: {
    usd: number;
    stx: number;
  };
  expires_in: number;
}
