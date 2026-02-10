import { TransactionsApi, Configuration } from '@stacks/blockchain-api-client';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { logger } from '../../utils/logger';

export interface TransactionVerification {
  success: boolean;
  error?: string;
  amount?: number;
  recipient?: string;
  sender?: string;
  timestamp?: number;
  blockHeight?: number;
}

export class PaymentVerifier {
  private api: TransactionsApi;
  private network: StacksMainnet | StacksTestnet;

  constructor() {
    const isMainnet = process.env.STACKS_NETWORK === 'mainnet';
    this.network = isMainnet ? new StacksMainnet() : new StacksTestnet();
    
    const config = new Configuration({
      basePath: this.network.coreApiUrl
    });
    
    this.api = new TransactionsApi(config);
  }

  async verifyTransaction(txId: string): Promise<TransactionVerification> {
    try {
      logger.info(`Verifying transaction: ${txId}`);
      const tx = await this.api.getTransactionById({ txId });

      if (tx.tx_status !== 'success') {
        return {
          success: false,
          error: `Transaction status: ${tx.tx_status}`
        };
      }

      if (tx.tx_type !== 'token_transfer') {
        return {
          success: false,
          error: 'Not a token transfer transaction'
        };
      }

      const tokenTransfer = tx.token_transfer;
      
      logger.info(`Transaction verified: ${tokenTransfer.amount} STX from ${tx.sender_address}`);

      return {
        success: true,
        amount: parseInt(tokenTransfer.amount),
        recipient: tokenTransfer.recipient_address,
        sender: tx.sender_address,
        timestamp: tx.burn_block_time,
        blockHeight: tx.block_height
      };

    } catch (error: any) {
      logger.error('Transaction verification error:', error);
      return {
        success: false,
        error: 'Failed to fetch transaction'
      };
    }
  }

  async waitForConfirmation(txId: string, maxWaitTime: number = 60000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const result = await this.verifyTransaction(txId);
      
      if (result.success) {
        return true;
      }

      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return false;
  }
}
