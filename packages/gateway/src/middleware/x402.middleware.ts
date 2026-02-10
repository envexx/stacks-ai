import { Request, Response, NextFunction } from 'express';
import { PaymentVerifier } from '../services/stacks/payment-verifier';
import { nonceManager } from '../services/cache/nonce-manager';
import { PricingService } from '../config/pricing';
import { logger } from '../utils/logger';
import { PaymentRequirements, PaymentPayload, X402Response, PaymentVerificationResult } from '../types/x402-stacks.types';

declare global {
  namespace Express {
    interface Request {
      paymentInfo?: {
        txId: string;
        amount: number;
        sender: string;
        timestamp: number;
      };
    }
  }
}

export class X402Middleware {
  private paymentVerifier: PaymentVerifier;
  private pricingService: PricingService;
  
  constructor() {
    this.paymentVerifier = new PaymentVerifier();
    this.pricingService = new PricingService();
  }

  requirePayment(options: {
    scheme: 'exact';
    asset: 'STX' | 'sBTC' | 'USDCx';
    modelType: string;
  }) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const paymentSignature = req.headers['payment-signature'] as string;

        if (!paymentSignature) {
          return this.sendPaymentRequired(res, options, req);
        }

        const verification = await this.verifyPayment(paymentSignature, options.modelType);

        if (!verification.valid) {
          return res.status(403).json({
            error: 'Payment verification failed',
            reason: verification.reason
          });
        }

        req.paymentInfo = verification.payment;

        next();
      } catch (error: any) {
        logger.error('X402 Middleware Error:', error);
        res.status(500).json({ error: 'Payment processing error' });
      }
    };
  }

  private async sendPaymentRequired(
    res: Response,
    options: { scheme: 'exact'; asset: 'STX' | 'sBTC' | 'USDCx'; modelType: string },
    req: Request
  ) {
    const nonce = await nonceManager.generate();
    const pricing = this.pricingService.getPrice(options.modelType);
    const network = process.env.STACKS_NETWORK || 'testnet';
    const resource = `/v1/prompt/${options.modelType}`;

    const paymentRequirements: PaymentRequirements = {
      scheme: options.scheme,
      network: `stacks:${network}`,
      asset: options.asset,
      payTo: process.env.PAYMENT_RECIPIENT_ADDRESS!,
      amount: pricing.basePrice.toString(),
      resource: resource,
      nonce: nonce,
      description: `Payment for ${options.modelType} AI model`,
      expiresAt: Date.now() + 300000
    };

    const response: X402Response = {
      paymentRequirements
    };

    logger.info('💰 Payment required', {
      model: options.modelType,
      amount: pricing.basePrice,
      asset: options.asset,
      network: paymentRequirements.network
    });

    return res.status(402).json(response);
  }

  private async verifyPayment(
    paymentSignatureHeader: string,
    modelType: string
  ): Promise<PaymentVerificationResult> {
    try {
      const payloadJson = Buffer.from(paymentSignatureHeader, 'base64').toString('utf-8');
      const payload: PaymentPayload = JSON.parse(payloadJson);

      const { paymentRequirements, signature, publicKey, txId } = payload;

      const nonceUsed = await nonceManager.isUsed(paymentRequirements.nonce);
      if (nonceUsed) {
        return {
          valid: false,
          reason: 'Nonce already used (replay attack prevention)'
        };
      }

      const nonceValid = await nonceManager.isValid(paymentRequirements.nonce);
      if (!nonceValid) {
        return {
          valid: false,
          reason: 'Nonce expired'
        };
      }

      if (paymentRequirements.expiresAt && Date.now() > paymentRequirements.expiresAt) {
        return {
          valid: false,
          reason: 'Payment requirements expired'
        };
      }

      if (!txId) {
        return {
          valid: false,
          reason: 'Transaction ID required'
        };
      }

      const txVerification = await this.paymentVerifier.verifyTransaction(txId);
      
      if (!txVerification.success) {
        return {
          valid: false,
          reason: txVerification.error || 'Transaction not found or pending'
        };
      }

      const expectedAmount = parseInt(paymentRequirements.amount);
      if (txVerification.amount! < expectedAmount) {
        return {
          valid: false,
          reason: `Insufficient payment. Expected: ${expectedAmount}, Got: ${txVerification.amount}`
        };
      }

      if (txVerification.recipient !== paymentRequirements.payTo) {
        return {
          valid: false,
          reason: 'Invalid recipient address'
        };
      }

      await nonceManager.markUsed(paymentRequirements.nonce);

      logger.info('✅ Payment verified', {
        txId,
        amount: txVerification.amount,
        sender: txVerification.sender
      });

      return {
        valid: true,
        payment: {
          txId,
          amount: txVerification.amount!,
          sender: txVerification.sender!,
          timestamp: txVerification.timestamp!
        }
      };
    } catch (error: any) {
      logger.error('Payment verification error:', error);
      return {
        valid: false,
        reason: 'Invalid payment signature format'
      };
    }
  }
}
