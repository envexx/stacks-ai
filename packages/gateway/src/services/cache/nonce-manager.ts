import { createClient } from 'redis';
import { generateNonce } from '../../utils/nonce-generator';
import { logger } from '../../utils/logger';

export class NonceManager {
  private client: ReturnType<typeof createClient> | null = null;
  private inMemoryStore: Map<string, { timestamp: number; used: boolean }> = new Map();
  private NONCE_EXPIRY = 300;

  async initialize() {
    if (!process.env.REDIS_URL) {
      logger.info('ℹ️  Redis not configured, using in-memory nonce storage');
      this.client = null;
      return;
    }

    try {
      this.client = createClient({
        url: process.env.REDIS_URL
      });
      
      this.client.on('error', () => {
        if (this.client) {
          this.client = null;
        }
      });

      await this.client.connect();
      logger.info('✅ Redis connected for nonce management');
    } catch (error) {
      logger.info('ℹ️  Redis unavailable, using in-memory nonce storage');
      this.client = null;
    }
  }

  async generate(): Promise<string> {
    const nonce = generateNonce();
    const timestamp = Date.now();

    if (this.client) {
      try {
        await this.client.setEx(`nonce:${nonce}`, this.NONCE_EXPIRY, JSON.stringify({
          timestamp,
          used: false
        }));
      } catch (error) {
        logger.warn('Redis set failed, using in-memory');
        this.inMemoryStore.set(nonce, { timestamp, used: false });
      }
    } else {
      this.inMemoryStore.set(nonce, { timestamp, used: false });
    }

    return nonce;
  }

  async isUsed(nonce: string): Promise<boolean> {
    if (this.client) {
      try {
        const data = await this.client.get(`nonce:${nonce}`);
        if (!data) return true;
        const parsed = JSON.parse(data);
        return parsed.used;
      } catch (error) {
        logger.warn('Redis get failed, checking in-memory');
      }
    }

    const data = this.inMemoryStore.get(nonce);
    return data ? data.used : true;
  }

  async isValid(nonce: string): Promise<boolean> {
    if (this.client) {
      try {
        const exists = await this.client.exists(`nonce:${nonce}`);
        return exists === 1;
      } catch (error) {
        logger.warn('Redis exists check failed');
      }
    }

    const data = this.inMemoryStore.get(nonce);
    if (!data) return false;

    const age = Date.now() - data.timestamp;
    return age < this.NONCE_EXPIRY * 1000;
  }

  async markUsed(nonce: string): Promise<void> {
    if (this.client) {
      try {
        const data = await this.client.get(`nonce:${nonce}`);
        if (data) {
          const parsed = JSON.parse(data);
          parsed.used = true;
          await this.client.setEx(`nonce:${nonce}`, this.NONCE_EXPIRY, JSON.stringify(parsed));
        }
      } catch (error) {
        logger.warn('Redis mark used failed');
      }
    }

    const data = this.inMemoryStore.get(nonce);
    if (data) {
      data.used = true;
    }
  }

  async cleanup() {
    if (this.client) {
      await this.client.quit();
    }
    
    const now = Date.now();
    for (const [nonce, data] of this.inMemoryStore.entries()) {
      if (now - data.timestamp > this.NONCE_EXPIRY * 1000) {
        this.inMemoryStore.delete(nonce);
      }
    }
  }
}

export const nonceManager = new NonceManager();
