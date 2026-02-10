# Stacks x402 Payment Protocol - Complete Integration Guide

## 📋 Table of Contents

1. [Protocol Overview](#protocol-overview)
2. [Architecture](#architecture)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Payment Flow](#payment-flow)
6. [Code Examples](#code-examples)
7. [Testing Guide](#testing-guide)
8. [Troubleshooting](#troubleshooting)
9. [Security Best Practices](#security-best-practices)

---

## 🎯 Protocol Overview

### What is x402?

The **x402 protocol** is a blockchain-based payment verification system inspired by HTTP 402 (Payment Required). It enables pay-per-use access to APIs and services using Stacks (STX) cryptocurrency.

### Key Features

- ✅ **Pay-per-use**: No subscriptions, pay only for what you consume
- ✅ **Blockchain verified**: All payments verified on Stacks blockchain
- ✅ **Replay protection**: Nonce-based system prevents double-spending
- ✅ **Transparent pricing**: On-chain pricing and payment proof
- ✅ **Micro-payments**: Support for small transactions (starting from 0.02 STX)

### Protocol Specification (x402-stacks v2)

```
HTTP/1.1 402 Payment Required
WWW-Authenticate: Stacks realm="resource-name"
Content-Type: application/json

{
  "status": 402,
  "error": "Payment Required",
  "paymentRequirements": {
    "scheme": "exact",
    "asset": "STX",
    "amount": "100000",
    "payTo": "ST3ES29PTAHRWTCAK6MPP3YCK84JNSJFNH340BK8P",
    "network": "stacks:testnet",
    "resource": "/v1/prompt/gpt4",
    "nonce": "unique-nonce-here",
    "description": "Payment for GPT-4 prompt",
    "expiresAt": 1234567890
  }
}
```

---

## 🏗️ Architecture

### System Components

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Client    │         │   Gateway    │         │   Stacks    │
│  (Browser)  │◄───────►│   (API)      │◄───────►│ Blockchain  │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │                        │
      │  1. Request API        │                        │
      │───────────────────────►│                        │
      │                        │                        │
      │  2. 402 Payment Req    │                        │
      │◄───────────────────────│                        │
      │                        │                        │
      │  3. STX Transfer       │                        │
      │────────────────────────┼───────────────────────►│
      │                        │                        │
      │  4. Retry with Proof   │                        │
      │───────────────────────►│                        │
      │                        │  5. Verify TX          │
      │                        │───────────────────────►│
      │                        │                        │
      │                        │  6. TX Confirmed       │
      │                        │◄───────────────────────│
      │  7. API Response       │                        │
      │◄───────────────────────│                        │
```

### Data Flow

1. **Initial Request**: Client requests protected resource
2. **Payment Required**: Server responds with 402 + payment instructions
3. **Payment**: Client makes STX transfer on-chain
4. **Retry with Proof**: Client retries request with transaction ID
5. **Verification**: Server verifies transaction on blockchain
6. **Nonce Check**: Server validates nonce (prevents replay)
7. **Response**: Server returns protected resource

---

## 🔧 Backend Implementation

### 1. Project Structure

```
packages/gateway/
├── src/
│   ├── middleware/
│   │   └── x402.middleware.ts       # Payment verification middleware
│   ├── services/
│   │   ├── payment/
│   │   │   ├── payment-verifier.ts  # Blockchain verification
│   │   │   └── pricing.service.ts   # Pricing logic
│   │   └── cache/
│   │       └── nonce-manager.ts     # Nonce management
│   ├── routes/
│   │   └── prompt.routes.ts         # Protected API routes
│   └── index.ts                     # Express server
├── .env                             # Environment variables
└── package.json
```

### 2. Environment Configuration

**`.env` file:**

```bash
# Server
PORT=3000
NODE_ENV=development

# Stacks Network
STACKS_NETWORK=testnet
PAYMENT_RECIPIENT_ADDRESS=ST3ES29PTAHRWTCAK6MPP3YCK84JNSJFNH340BK8P

# API Keys (for protected resources)
OPENAI_API_KEY=sk-proj-your-key-here
ANTHROPIC_API_KEY=your-anthropic-key

# Redis (optional, for nonce storage)
# REDIS_URL=redis://localhost:6379
```

### 3. Nonce Manager Implementation

**`src/services/cache/nonce-manager.ts`:**

```typescript
import { createClient } from 'redis';
import { logger } from '../../utils/logger';

class NonceManager {
  private redis: any = null;
  private inMemoryNonces: Map<string, { timestamp: number; used: boolean }> = new Map();
  private readonly NONCE_EXPIRY = 5 * 60 * 1000; // 5 minutes

  async initialize() {
    if (process.env.REDIS_URL) {
      try {
        this.redis = createClient({ url: process.env.REDIS_URL });
        await this.redis.connect();
        logger.info('✅ Redis connected for nonce management');
      } catch (error) {
        logger.warn('⚠️  Redis connection failed, using in-memory storage');
        this.redis = null;
      }
    } else {
      logger.info('ℹ️  Redis not configured, using in-memory nonce storage');
    }
  }

  async generate(): Promise<string> {
    const nonce = crypto.randomUUID();
    const timestamp = Date.now();

    if (this.redis) {
      await this.redis.setEx(`nonce:${nonce}`, 300, JSON.stringify({ timestamp, used: false }));
    } else {
      this.inMemoryNonces.set(nonce, { timestamp, used: false });
      this.cleanupExpired();
    }

    return nonce;
  }

  async isValid(nonce: string): Promise<boolean> {
    if (this.redis) {
      const data = await this.redis.get(`nonce:${nonce}`);
      if (!data) return false;
      const { timestamp } = JSON.parse(data);
      return Date.now() - timestamp < this.NONCE_EXPIRY;
    } else {
      const data = this.inMemoryNonces.get(nonce);
      if (!data) return false;
      return Date.now() - data.timestamp < this.NONCE_EXPIRY;
    }
  }

  async isUsed(nonce: string): Promise<boolean> {
    if (this.redis) {
      const data = await this.redis.get(`nonce:${nonce}`);
      if (!data) return false;
      const { used } = JSON.parse(data);
      return used;
    } else {
      const data = this.inMemoryNonces.get(nonce);
      return data?.used || false;
    }
  }

  async markUsed(nonce: string): Promise<void> {
    if (this.redis) {
      const data = await this.redis.get(`nonce:${nonce}`);
      if (data) {
        const parsed = JSON.parse(data);
        parsed.used = true;
        await this.redis.setEx(`nonce:${nonce}`, 300, JSON.stringify(parsed));
      }
    } else {
      const data = this.inMemoryNonces.get(nonce);
      if (data) {
        data.used = true;
      }
    }
  }

  private cleanupExpired() {
    const now = Date.now();
    for (const [nonce, data] of this.inMemoryNonces.entries()) {
      if (now - data.timestamp > this.NONCE_EXPIRY) {
        this.inMemoryNonces.delete(nonce);
      }
    }
  }
}

export const nonceManager = new NonceManager();
```

### 4. Payment Verifier Implementation

**`src/services/payment/payment-verifier.ts`:**

```typescript
import axios from 'axios';
import { logger } from '../../utils/logger';

export interface TransactionVerification {
  success: boolean;
  amount?: number;
  sender?: string;
  recipient?: string;
  timestamp?: number;
  error?: string;
}

export class PaymentVerifier {
  private readonly STACKS_API_URL = 
    process.env.STACKS_NETWORK === 'mainnet'
      ? 'https://api.mainnet.hiro.so'
      : 'https://api.testnet.hiro.so';

  async verifyTransaction(txId: string): Promise<TransactionVerification> {
    try {
      logger.info(`Verifying transaction: ${txId}`);

      const response = await axios.get(
        `${this.STACKS_API_URL}/extended/v1/tx/${txId}`
      );

      const tx = response.data;

      // Check if transaction is confirmed
      if (tx.tx_status !== 'success') {
        return {
          success: false,
          error: `Transaction not confirmed. Status: ${tx.tx_status}`
        };
      }

      // Verify it's a STX transfer
      if (tx.tx_type !== 'token_transfer') {
        return {
          success: false,
          error: 'Not a token transfer transaction'
        };
      }

      // Extract payment details
      const amount = parseInt(tx.token_transfer.amount);
      const sender = tx.sender_address;
      const recipient = tx.token_transfer.recipient_address;
      const timestamp = tx.burn_block_time;

      logger.info(`Transaction verified: ${amount} STX from ${sender}`);

      return {
        success: true,
        amount,
        sender,
        recipient,
        timestamp
      };
    } catch (error: any) {
      logger.error('Transaction verification failed:', error.message);
      return {
        success: false,
        error: error.message || 'Transaction verification failed'
      };
    }
  }
}
```

### 5. Pricing Service Implementation

**`src/config/pricing.ts`:**

```typescript
export interface PricingInfo {
  basePrice: number;      // in microSTX (1 STX = 1,000,000 microSTX)
  usdEquivalent: number;  // approximate USD value
  description: string;
}

export class PricingService {
  private pricing: Record<string, PricingInfo> = {
    'gpt4': {
      basePrice: 100000,        // 0.1 STX
      usdEquivalent: 0.20,
      description: 'GPT-4 Turbo prompt'
    },
    'claude': {
      basePrice: 120000,        // 0.12 STX
      usdEquivalent: 0.24,
      description: 'Claude 3 Opus prompt'
    },
    'gpt-3.5': {
      basePrice: 20000,         // 0.02 STX
      usdEquivalent: 0.04,
      description: 'GPT-3.5 Turbo prompt'
    }
  };

  getPrice(modelType: string): PricingInfo {
    return this.pricing[modelType] || this.pricing['gpt-3.5'];
  }

  getAllPricing(): Record<string, PricingInfo> {
    return this.pricing;
  }
}
```

### 6. X402 Middleware Implementation

**`src/middleware/x402.middleware.ts`:**

```typescript
import { Request, Response, NextFunction } from 'express';
import { PaymentVerifier } from '../services/payment/payment-verifier';
import { PricingService } from '../config/pricing';
import { nonceManager } from '../services/cache/nonce-manager';
import { logger } from '../utils/logger';

interface PaymentRequirements {
  scheme: 'exact';
  asset: 'STX';
  amount: string;
  payTo: string;
  network: string;
  resource: string;
  nonce: string;
  description: string;
  expiresAt: number;
}

export class X402Middleware {
  private paymentVerifier: PaymentVerifier;
  private pricingService: PricingService;

  constructor() {
    this.paymentVerifier = new PaymentVerifier();
    this.pricingService = new PricingService();
  }

  requirePayment(options: { scheme: string; asset: string; modelType: string }) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Check for payment proof in headers
        const paymentSignature = req.headers['payment-signature'] as string;

        if (!paymentSignature) {
          // No payment proof - send 402 Payment Required
          return this.sendPaymentRequired(res, options.modelType, req);
        }

        // Decode payment proof
        const paymentProof = JSON.parse(
          Buffer.from(paymentSignature, 'base64').toString('utf-8')
        );

        const { txId, nonce } = paymentProof;

        // Verify payment
        const verification = await this.verifyPayment(
          txId,
          nonce,
          options.modelType
        );

        if (!verification.valid) {
          return res.status(403).json({
            error: 'Payment verification failed',
            reason: verification.reason
          });
        }

        // Mark nonce as used
        await nonceManager.markUsed(nonce);

        // Attach payment info to request
        (req as any).paymentInfo = verification.payment;

        logger.info('✅ Payment verified', verification.payment);

        next();
      } catch (error: any) {
        logger.error('X402 Middleware Error:', error);
        res.status(500).json({ error: 'Payment processing error' });
      }
    };
  }

  private async sendPaymentRequired(
    res: Response,
    modelType: string,
    req: Request
  ) {
    const nonce = await nonceManager.generate();
    const pricing = this.pricingService.getPrice(modelType);

    const paymentRequirements: PaymentRequirements = {
      scheme: 'exact',
      asset: 'STX',
      amount: pricing.basePrice.toString(),
      payTo: process.env.PAYMENT_RECIPIENT_ADDRESS!,
      network: `stacks:${process.env.STACKS_NETWORK || 'testnet'}`,
      resource: `/v1/prompt/${modelType}`,
      nonce: nonce,
      description: `Payment for ${modelType} AI model`,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    };

    logger.info('💰 Payment required', {
      amount: pricing.basePrice,
      asset: 'STX',
      model: modelType,
      network: paymentRequirements.network
    });

    res.set('WWW-Authenticate', `Stacks realm="${modelType}"`);
    res.status(402).json({
      status: 402,
      error: 'Payment Required',
      paymentRequirements
    });
  }

  private async verifyPayment(
    txId: string,
    nonce: string,
    modelType: string
  ): Promise<{ valid: boolean; reason?: string; payment?: any }> {
    // Check nonce validity
    const nonceUsed = await nonceManager.isUsed(nonce);
    if (nonceUsed) {
      return {
        valid: false,
        reason: 'Nonce already used (replay attack prevention)'
      };
    }

    const nonceValid = await nonceManager.isValid(nonce);
    if (!nonceValid) {
      return {
        valid: false,
        reason: 'Nonce expired or invalid'
      };
    }

    // Verify transaction on blockchain
    const txVerification = await this.paymentVerifier.verifyTransaction(txId);

    if (!txVerification.success) {
      return {
        valid: false,
        reason: txVerification.error || 'Transaction verification failed'
      };
    }

    // Check payment amount
    const expectedAmount = this.pricingService.getPrice(modelType).basePrice;
    if (txVerification.amount! < expectedAmount) {
      return {
        valid: false,
        reason: `Insufficient payment. Expected: ${expectedAmount}, Got: ${txVerification.amount}`
      };
    }

    // Check recipient address
    if (txVerification.recipient !== process.env.PAYMENT_RECIPIENT_ADDRESS) {
      return {
        valid: false,
        reason: 'Invalid recipient address'
      };
    }

    return {
      valid: true,
      payment: {
        txId,
        amount: txVerification.amount,
        sender: txVerification.sender,
        timestamp: txVerification.timestamp
      }
    };
  }
}
```

### 7. Protected Route Implementation

**`src/routes/prompt.routes.ts`:**

```typescript
import { Router } from 'express';
import { X402Middleware } from '../middleware/x402.middleware';
import { AIRouterService } from '../services/ai/ai-router.service';
import { logger } from '../utils/logger';

const router = Router();
const x402 = new X402Middleware();

// Lazy initialization for AI router (after env vars loaded)
let aiRouter: AIRouterService | null = null;
function getAIRouter(): AIRouterService {
  if (!aiRouter) {
    aiRouter = new AIRouterService();
  }
  return aiRouter;
}

// Protected endpoint with x402 payment requirement
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

    // Call AI service
    const response = await getAIRouter().routePrompt(model, prompt, {
      maxTokens,
      temperature
    });

    res.json({
      ...response,
      payment: (req as any).paymentInfo
    });

  } catch (error: any) {
    logger.error('Prompt processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process prompt',
      message: error.message 
    });
  }
});

export { router as promptRoutes };
```

---

## 💻 Frontend Implementation

### 1. Wallet Connection Hook

**`src/hooks/useWalletConnect.ts`:**

```typescript
import { useState, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function useWalletConnect() {
  const [walletData, setWalletData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check for Hiro Wallet extension
    if (typeof window !== 'undefined' && !(window as any).StacksProvider) {
      console.warn('⚠️  Hiro Wallet extension not detected');
    }

    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setWalletData(userData);
      setIsConnected(true);
    }
  }, []);

  const connect = () => {
    showConnect({
      appDetails: {
        name: 'StacksAI Gateway',
        icon: window.location.origin + '/logo.png'
      },
      onFinish: () => {
        const userData = userSession.loadUserData();
        setWalletData(userData);
        setIsConnected(true);
      },
      userSession
    });
  };

  const disconnect = () => {
    userSession.signUserOut();
    setWalletData(null);
    setIsConnected(false);
  };

  return {
    walletData,
    isConnected,
    connect,
    disconnect,
    address: walletData?.profile?.stxAddress?.testnet || 
             walletData?.profile?.stxAddress?.mainnet
  };
}
```

### 2. Payment Hook

**`src/hooks/useStacksPayment.ts`:**

```typescript
import { useState } from 'react';
import { openSTXTransfer } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import axios from 'axios';

const STACKS_API_URL = 
  process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet'
    ? 'https://api.mainnet.hiro.so'
    : 'https://api.testnet.hiro.so';

export function useStacksPayment() {
  const [isPaying, setIsPaying] = useState(false);

  const makePayment = async (params: {
    recipient: string;
    amount: string;
    memo?: string;
  }) => {
    setIsPaying(true);

    try {
      const network = process.env.NEXT_PUBLIC_STACKS_NETWORK === 'mainnet'
        ? new StacksMainnet()
        : new StacksTestnet();

      return new Promise<string>((resolve, reject) => {
        openSTXTransfer({
          recipient: params.recipient,
          amount: params.amount,
          network,
          onFinish: (data) => {
            console.log('✅ Payment transaction broadcast:', data.txId);
            resolve(data.txId);
          },
          onCancel: () => {
            reject(new Error('Payment cancelled by user'));
          }
        });
      });
    } catch (error: any) {
      console.error('❌ Payment failed:', error);
      throw error;
    } finally {
      setIsPaying(false);
    }
  };

  const waitForConfirmation = async (txId: string): Promise<void> => {
    const maxAttempts = 60; // 5 minutes (5s interval)
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const response = await axios.get(
          `${STACKS_API_URL}/extended/v1/tx/${txId}`
        );

        if (response.data.tx_status === 'success') {
          console.log('✅ Transaction confirmed!');
          return;
        }

        if (response.data.tx_status === 'abort_by_response' || 
            response.data.tx_status === 'abort_by_post_condition') {
          throw new Error('Transaction failed');
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;
      } catch (error: any) {
        if (error.response?.status === 404) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          attempts++;
          continue;
        }
        throw error;
      }
    }

    throw new Error('Transaction confirmation timeout');
  };

  return {
    makePayment,
    waitForConfirmation,
    isPaying
  };
}
```

### 3. Complete Payment Flow Component

**`src/app/playground/page.tsx` (excerpt):**

```typescript
'use client';

import { useState } from 'react';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { useStacksPayment } from '@/hooks/useStacksPayment';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Playground() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt4');

  const { isConnected, connect, address } = useWalletConnect();
  const { makePayment, waitForConfirmation, isPaying } = useStacksPayment();

  const handleSubmit = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      // Step 1: Initial request (will get 402)
      const initialResponse = await fetch(`${API_URL}/v1/prompt/${selectedModel}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (initialResponse.status === 402) {
        // Step 2: Parse payment requirements
        const paymentData = await initialResponse.json();
        const paymentReqs = paymentData.paymentRequirements;

        console.log('💰 Payment required:', paymentReqs);

        // Step 3: Make payment
        const txId = await makePayment({
          recipient: paymentReqs.payTo,
          amount: paymentReqs.amount
        });

        console.log('✅ Payment sent:', txId);
        console.log('⏳ Waiting for confirmation...');

        // Step 4: Wait for blockchain confirmation
        await waitForConfirmation(txId);

        console.log('✅ Payment confirmed! Retrying request...');

        // Step 5: Create payment proof
        const paymentProof = {
          txId,
          nonce: paymentReqs.nonce,
          amount: paymentReqs.amount,
          recipient: paymentReqs.payTo
        };

        // Step 6: Retry request with payment proof
        const retryResponse = await fetch(`${API_URL}/v1/prompt/${selectedModel}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'PAYMENT-SIGNATURE': Buffer.from(JSON.stringify(paymentProof)).toString('base64')
          },
          body: JSON.stringify({ prompt })
        });

        const data = await retryResponse.json();
        setResponse(data.response || data.message);
      } else {
        // Direct response (shouldn't happen on first request)
        const data = await initialResponse.json();
        setResponse(data.response || data.message);
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">AI Playground</h1>
      
      {!isConnected ? (
        <button onClick={connect} className="btn-primary">
          Connect Wallet
        </button>
      ) : (
        <div>
          <p className="mb-4">Connected: {address}</p>
          
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="mb-4"
          >
            <option value="gpt4">GPT-4 (0.1 STX)</option>
            <option value="claude">Claude (0.12 STX)</option>
            <option value="gpt-3.5">GPT-3.5 (0.02 STX)</option>
          </select>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            className="w-full p-4 border rounded mb-4"
            rows={4}
          />

          <button
            onClick={handleSubmit}
            disabled={loading || isPaying}
            className="btn-primary"
          >
            {loading ? 'Processing...' : isPaying ? 'Paying...' : 'Submit'}
          </button>

          {response && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-bold mb-2">Response:</h3>
              <p>{response}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     COMPLETE PAYMENT FLOW                        │
└─────────────────────────────────────────────────────────────────┘

1. USER ACTION: Click "Submit Prompt"
   │
   ├─► Check wallet connection
   │   └─► If not connected: Show "Connect Wallet" button
   │
2. INITIAL API REQUEST
   │
   ├─► POST /v1/prompt/gpt4
   │   Headers: { Content-Type: application/json }
   │   Body: { prompt: "Your question here" }
   │
3. SERVER RESPONSE: 402 Payment Required
   │
   ├─► Status: 402
   ├─► Headers: WWW-Authenticate: Stacks realm="gpt4"
   └─► Body: {
         "status": 402,
         "error": "Payment Required",
         "paymentRequirements": {
           "scheme": "exact",
           "asset": "STX",
           "amount": "100000",
           "payTo": "ST3ES29PTAHRWTCAK6MPP3YCK84JNSJFNH340BK8P",
           "network": "stacks:testnet",
           "resource": "/v1/prompt/gpt4",
           "nonce": "abc-123-def-456",
           "description": "Payment for GPT-4 prompt",
           "expiresAt": 1234567890
         }
       }
   │
4. CLIENT: Parse Payment Requirements
   │
   ├─► Extract: amount, payTo, nonce
   │
5. CLIENT: Initiate STX Transfer
   │
   ├─► openSTXTransfer({
   │     recipient: "ST3ES29PTAHRWTCAK6MPP3YCK84JNSJFNH340BK8P",
   │     amount: "100000",
   │     network: StacksTestnet
   │   })
   │
6. WALLET: User Approves Transaction
   │
   ├─► Hiro Wallet popup appears
   ├─► User reviews and confirms
   └─► Transaction broadcast to blockchain
   │
7. BLOCKCHAIN: Transaction Pending
   │
   ├─► TxID returned: "0x123abc..."
   ├─► Status: pending
   │
8. CLIENT: Wait for Confirmation
   │
   ├─► Poll Stacks API every 5 seconds
   ├─► GET /extended/v1/tx/0x123abc...
   └─► Wait until tx_status === "success"
   │
9. BLOCKCHAIN: Transaction Confirmed
   │
   ├─► Status: success
   ├─► Amount: 100000 microSTX
   ├─► Sender: ST15ZFAZ505NA30T11GY343C394AE73YVEJGDVWV8
   └─► Recipient: ST3ES29PTAHRWTCAK6MPP3YCK84JNSJFNH340BK8P
   │
10. CLIENT: Create Payment Proof
    │
    ├─► paymentProof = {
    │     txId: "0x123abc...",
    │     nonce: "abc-123-def-456",
    │     amount: "100000",
    │     recipient: "ST3ES29PTAHRWTCAK6MPP3YCK84JNSJFNH340BK8P"
    │   }
    │
    └─► Encode as Base64:
        Buffer.from(JSON.stringify(paymentProof)).toString('base64')
    │
11. CLIENT: Retry API Request with Proof
    │
    ├─► POST /v1/prompt/gpt4
    │   Headers: {
    │     Content-Type: application/json,
    │     PAYMENT-SIGNATURE: "eyJ0eElkIjoiMHgxMjNhYmMuLi4i..."
    │   }
    │   Body: { prompt: "Your question here" }
    │
12. SERVER: Verify Payment
    │
    ├─► Decode PAYMENT-SIGNATURE header
    ├─► Extract txId and nonce
    ├─► Check nonce validity (not expired, not used)
    ├─► Verify transaction on blockchain
    ├─► Validate amount >= expected
    ├─► Validate recipient === configured address
    ├─► Mark nonce as used
    │
13. SERVER: Process Request
    │
    ├─► Call OpenAI API
    ├─► Get AI response
    │
14. SERVER: Return Response
    │
    └─► Status: 200 OK
        Body: {
          "model": "gpt4",
          "response": "AI generated response here...",
          "usage": { ... },
          "payment": {
            "txId": "0x123abc...",
            "amount": 100000,
            "sender": "ST15ZFAZ505NA30T11GY343C394AE73YVEJGDVWV8"
          }
        }
    │
15. CLIENT: Display Response
    │
    └─► Show AI response to user
```

---

## 🧪 Testing Guide

### 1. Local Development Setup

```bash
# Terminal 1: Start Backend
cd packages/gateway
pnpm install
pnpm dev

# Terminal 2: Start Frontend
cd packages/web-demo
pnpm install
pnpm dev
```

### 2. Environment Setup

**Backend `.env`:**
```bash
PORT=3000
STACKS_NETWORK=testnet
PAYMENT_RECIPIENT_ADDRESS=ST3ES29PTAHRWTCAK6MPP3YCK84JNSJFNH340BK8P
OPENAI_API_KEY=sk-proj-your-key
```

**Frontend `.env.local`:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STACKS_NETWORK=testnet
```

### 3. Test Wallet Setup

1. Install **Hiro Wallet** browser extension
2. Create new wallet or import existing
3. Switch to **Testnet** network
4. Get testnet STX from faucet: https://explorer.hiro.so/sandbox/faucet

### 4. Manual Testing Steps

**Test 1: Payment Flow**
```
1. Open http://localhost:3001/playground
2. Click "Connect Wallet"
3. Approve wallet connection
4. Select model (e.g., GPT-4)
5. Enter prompt: "Explain quantum computing"
6. Click "Submit"
7. Verify 402 response in console
8. Approve payment in wallet popup
9. Wait for confirmation (~30-60 seconds)
10. Verify AI response appears
```

**Test 2: Nonce Replay Protection**
```
1. Complete a successful payment
2. Copy the PAYMENT-SIGNATURE header from network tab
3. Try to reuse same signature in new request
4. Should get 403 error: "Nonce already used"
```

**Test 3: Insufficient Payment**
```
1. Modify payment amount in code (reduce by 50%)
2. Complete payment flow
3. Should get 403 error: "Insufficient payment"
```

### 5. Automated Testing

**Backend Unit Tests:**

```typescript
// tests/x402.test.ts
import { X402Middleware } from '../src/middleware/x402.middleware';
import { nonceManager } from '../src/services/cache/nonce-manager';

describe('X402 Middleware', () => {
  beforeAll(async () => {
    await nonceManager.initialize();
  });

  test('should generate valid nonce', async () => {
    const nonce = await nonceManager.generate();
    expect(nonce).toBeDefined();
    expect(await nonceManager.isValid(nonce)).toBe(true);
  });

  test('should detect used nonce', async () => {
    const nonce = await nonceManager.generate();
    await nonceManager.markUsed(nonce);
    expect(await nonceManager.isUsed(nonce)).toBe(true);
  });

  test('should reject expired nonce', async () => {
    const nonce = await nonceManager.generate();
    // Wait for expiry (mock time)
    jest.advanceTimersByTime(6 * 60 * 1000);
    expect(await nonceManager.isValid(nonce)).toBe(false);
  });
});
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. **"Hiro Wallet not detected"**

**Problem:** Extension not installed or not enabled

**Solution:**
```
1. Install Hiro Wallet from Chrome Web Store
2. Refresh browser page
3. Check console for StacksProvider object
```

#### 2. **"Transaction not confirmed"**

**Problem:** Transaction stuck in pending state

**Solution:**
```
1. Check Stacks Explorer: https://explorer.hiro.so/
2. Verify transaction status
3. Increase gas fee if stuck
4. Wait up to 10 minutes for testnet
```

#### 3. **"Nonce already used"**

**Problem:** Attempting to reuse payment proof

**Solution:**
```
1. This is expected behavior (replay protection)
2. Make new payment for each request
3. Don't cache/reuse payment signatures
```

#### 4. **"OpenAI API key not configured"**

**Problem:** Environment variable not loaded

**Solution:**
```
1. Check .env file exists in packages/gateway/
2. Verify OPENAI_API_KEY is set
3. Restart backend server
4. Check console for "Environment check" debug output
```

#### 5. **"Payment recipient mismatch"**

**Problem:** Wrong recipient address in transaction

**Solution:**
```
1. Verify PAYMENT_RECIPIENT_ADDRESS in .env
2. Ensure frontend uses correct payTo from 402 response
3. Don't hardcode recipient address in frontend
```

### Debug Checklist

```
✅ Backend running on port 3000
✅ Frontend running on port 3001
✅ Hiro Wallet installed and connected
✅ Wallet on testnet network
✅ Wallet has testnet STX (>0.1 STX)
✅ Environment variables loaded
✅ CORS enabled on backend
✅ Network requests not blocked by firewall
```

---

## 🔒 Security Best Practices

### 1. Nonce Management

```typescript
// ✅ GOOD: Generate unique nonce per request
const nonce = await nonceManager.generate();

// ❌ BAD: Reusing nonces
const nonce = "fixed-nonce-123"; // NEVER DO THIS
```

### 2. Payment Verification

```typescript
// ✅ GOOD: Verify all payment parameters
if (txVerification.amount < expectedAmount) {
  return { valid: false, reason: 'Insufficient payment' };
}
if (txVerification.recipient !== process.env.PAYMENT_RECIPIENT_ADDRESS) {
  return { valid: false, reason: 'Invalid recipient' };
}

// ❌ BAD: Trust client-provided amounts
const amount = req.body.amount; // NEVER TRUST CLIENT
```

### 3. Environment Variables

```bash
# ✅ GOOD: Use environment variables
PAYMENT_RECIPIENT_ADDRESS=ST3ES29PTAHRWTCAK6MPP3YCK84JNSJFNH340BK8P

# ❌ BAD: Hardcode in source code
const recipient = "ST3ES29PTAHRWTCAK6MPP3YCK84JNSJFNH340BK8P"; // NO!
```

### 4. Error Handling

```typescript
// ✅ GOOD: Generic error messages to client
res.status(403).json({ error: 'Payment verification failed' });

// ❌ BAD: Expose internal details
res.status(403).json({ 
  error: 'Payment failed',
  details: 'Database connection error at line 123' // NO!
});
```

### 5. Rate Limiting

```typescript
// ✅ GOOD: Implement rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/v1/', limiter);
```

---

## 📚 Additional Resources

### Documentation
- [Stacks Documentation](https://docs.stacks.co/)
- [Stacks Connect](https://github.com/hirosystems/connect)
- [Hiro API Reference](https://docs.hiro.so/api)

### Tools
- [Stacks Explorer](https://explorer.hiro.so/)
- [Testnet Faucet](https://explorer.hiro.so/sandbox/faucet)
- [Clarity Tools](https://clarity-lang.org/)

### Community
- [Stacks Discord](https://discord.gg/stacks)
- [Stacks Forum](https://forum.stacks.org/)
- [GitHub Discussions](https://github.com/stacks-network/stacks-blockchain/discussions)

---

## 📄 License

This integration guide is provided as-is for educational and development purposes.

---

**Built with ❤️ on Stacks Blockchain**
