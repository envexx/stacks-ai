import { openSTXTransfer } from '@stacks/connect';
import axios, { AxiosInstance } from 'axios';
import type { ClientConfig, PromptOptions, AIResponse } from './types';
import type { PaymentRequirements, PaymentPayload, X402Response } from './types/x402-stacks.types';

export class StacksAIClient {
  private api: AxiosInstance;
  private gatewayUrl: string;

  constructor(config?: ClientConfig) {
    this.gatewayUrl = config?.gatewayUrl || 'http://localhost:3000';
    
    this.api = axios.create({
      baseURL: this.gatewayUrl,
      timeout: 30000
    });
  }

  async prompt(
    model: 'gpt4' | 'claude' | 'gpt-3.5',
    prompt: string,
    options?: PromptOptions
  ): Promise<AIResponse> {
    try {
      const response = await this.api.post(`/v1/prompt/${model}`, {
        prompt,
        ...options
      });

      return response.data;

    } catch (error: any) {
      if (error.response?.status === 402) {
        const x402Response: X402Response = error.response.data;
        const paymentReqs = x402Response.paymentRequirements;
        
        console.log('💰 Payment required:', {
          amount: `${parseInt(paymentReqs.amount) / 1_000_000} ${paymentReqs.asset}`,
          network: paymentReqs.network,
          model: model
        });

        const txId = await this.makePayment(paymentReqs);
        
        console.log('✅ Payment sent:', txId);
        console.log('⏳ Waiting for confirmation...');

        await this.waitForConfirmation(txId);

        console.log('✅ Payment confirmed!');

        const paymentPayload = await this.createPaymentPayload(paymentReqs, txId);

        const retryResponse = await this.api.post(
          `/v1/prompt/${model}`,
          { 
            prompt, 
            ...options 
          },
          {
            headers: {
              'PAYMENT-SIGNATURE': Buffer.from(JSON.stringify(paymentPayload)).toString('base64')
            }
          }
        );

        return retryResponse.data;
      }

      throw error;
    }
  }

  async getModels() {
    const response = await this.api.get('/v1/prompt/models');
    return response.data;
  }

  private async makePayment(paymentReqs: PaymentRequirements): Promise<string> {
    return new Promise((resolve, reject) => {
      openSTXTransfer({
        recipient: paymentReqs.payTo,
        amount: paymentReqs.amount,
        memo: `StacksAI: ${paymentReqs.resource}`,
        network: paymentReqs.network.split(':')[1] as any,
        onFinish: (data) => {
          resolve(data.txId);
        },
        onCancel: () => {
          reject(new Error('Payment cancelled by user'));
        }
      });
    });
  }

  private async createPaymentPayload(
    paymentReqs: PaymentRequirements,
    txId: string
  ): Promise<PaymentPayload> {
    return {
      paymentRequirements: paymentReqs,
      signature: '',
      publicKey: '',
      txId: txId
    };
  }

  private async waitForConfirmation(txId: string): Promise<void> {
    const maxWait = 60000;
    const interval = 5000;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
}
