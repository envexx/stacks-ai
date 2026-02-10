export interface PaymentRequirements {
  scheme: 'exact';
  network: string;
  asset: 'STX' | 'sBTC' | 'USDCx';
  payTo: string;
  amount: string;
  resource: string;
  nonce: string;
  description?: string;
  expiresAt?: number;
}

export interface PaymentPayload {
  paymentRequirements: PaymentRequirements;
  signature: string;
  publicKey: string;
  txId?: string;
}

export interface X402Response {
  paymentRequirements: PaymentRequirements;
}

export interface PaymentVerificationResult {
  valid: boolean;
  reason?: string;
  payment?: {
    txId: string;
    amount: number;
    sender: string;
    timestamp: number;
  };
}
