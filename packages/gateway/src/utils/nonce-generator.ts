import crypto from 'crypto';

export function generateNonce(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashNonce(nonce: string): string {
  return crypto.createHash('sha256').update(nonce).digest('hex');
}
