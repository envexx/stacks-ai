# 📖 Setup Guide - StacksAI Gateway

Complete step-by-step guide to get StacksAI Gateway running locally.

## Prerequisites

### Required Software

1. **Node.js 20+**
   ```bash
   node --version  # Should be v20.x.x or higher
   ```

2. **pnpm 8+**
   ```bash
   npm install -g pnpm
   pnpm --version  # Should be 8.x.x or higher
   ```

3. **Git**
   ```bash
   git --version
   ```

### Optional (Recommended)

4. **Redis** (for production-grade nonce management)
   - Windows: Download from https://github.com/microsoftarchive/redis/releases
   - Mac: `brew install redis`
   - Linux: `sudo apt-get install redis-server`

## Step 1: Clone & Install

```bash
# Navigate to project directory
cd c:\Users\HP\OneDrive\Dokumen\Program\hacktone\stack

# Install all dependencies
pnpm install
```

This will install dependencies for all packages (gateway, sdk, web-demo).

## Step 2: Configure Environment

### Create .env file

Create a `.env` file in the root directory:

```bash
# Copy from example
cp env.example .env
```

### Edit .env with your configuration

```env
# Gateway Configuration
PORT=3000
NODE_ENV=development

# Stacks Network (use testnet for development)
STACKS_NETWORK=testnet
PAYMENT_RECIPIENT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

# AI Provider API Keys
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...your-key-here

# Get from: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-...your-key-here

# Redis (optional - will use in-memory if not available)
REDIS_URL=redis://localhost:6379
```

### Get API Keys

#### OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key to your `.env` file

#### Anthropic API Key
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy to your `.env` file

#### Stacks Wallet Address
1. Install Hiro Wallet: https://wallet.hiro.so/
2. Create or import a wallet
3. Switch to Testnet
4. Copy your STX address
5. Use it as `PAYMENT_RECIPIENT_ADDRESS`

## Step 3: Start Redis (Optional)

If you have Redis installed:

```bash
# Windows
redis-server

# Mac/Linux
redis-server
```

If Redis is not available, the gateway will automatically fall back to in-memory storage.

## Step 4: Run the Gateway

### Option A: Run All Packages

```bash
pnpm dev
```

This starts:
- Gateway on http://localhost:3000
- Web Demo on http://localhost:3001

### Option B: Run Individual Packages

**Terminal 1 - Gateway:**
```bash
pnpm gateway:dev
```

**Terminal 2 - Web Demo:**
```bash
pnpm web:dev
```

## Step 5: Verify Installation

### Test Gateway Health

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-02-10T...",
  "service": "StacksAI Gateway",
  "version": "1.0.0"
}
```

### Test 402 Payment Flow

```bash
curl http://localhost:3000/v1/prompt/gpt4 \
  -H "Content-Type: application/json" \
  -d "{\"prompt\": \"Hello\"}"
```

Expected response (402):
```json
{
  "status": 402,
  "error": "Payment Required",
  "payment": {
    "amount": 100000,
    "currency": "STX",
    "recipient": "ST1...",
    "nonce": "...",
    "estimatedCost": {
      "usd": 0.20,
      "stx": 0.1
    }
  }
}
```

### Test Web Demo

1. Open http://localhost:3001 in your browser
2. You should see the landing page
3. Click "Try Playground"
4. You should see the playground interface

## Step 6: Test with Stacks Wallet

### Setup Testnet Wallet

1. Install Hiro Wallet extension
2. Create/import wallet
3. Switch to Testnet
4. Get testnet STX from faucet:
   - https://explorer.stacks.co/sandbox/faucet

### Connect Wallet in Web Demo

1. Go to http://localhost:3001/playground
2. Click "Connect Wallet"
3. Approve connection in Hiro Wallet
4. Select a model and enter a prompt
5. Click "Send Prompt"
6. Approve the STX payment in your wallet
7. Wait for confirmation
8. See the AI response!

## Troubleshooting

### Port Already in Use

If port 3000 or 3001 is already in use:

```env
# In .env
PORT=3002  # Change to any available port
```

### Redis Connection Error

If you see Redis errors but don't have Redis:
- Don't worry! The system will automatically use in-memory storage
- For production, install Redis for better performance

### API Key Errors

If you get "API key not configured" errors:
- Make sure your `.env` file is in the root directory
- Verify API keys are correct (no extra spaces)
- Restart the gateway after changing `.env`

### Module Not Found Errors

```bash
# Clean install
rm -rf node_modules
rm -rf packages/*/node_modules
pnpm install
```

### TypeScript Errors

TypeScript errors are expected before running `pnpm install`. After installation, they should resolve.

## Next Steps

1. **Read the API Documentation**: See `PROJECT_README.md`
2. **Try the SDK**: Check `packages/sdk/README.md`
3. **Explore the Code**: Start with `packages/gateway/src/index.ts`
4. **Test Payment Flow**: Use the web demo to test end-to-end

## Development Tips

### Hot Reload

All packages support hot reload. Changes to code will automatically restart the servers.

### Debugging

Add `console.log` or use the logger:

```typescript
import { logger } from './utils/logger';
logger.info('Debug message');
```

### Testing API Endpoints

Use tools like:
- curl (command line)
- Postman
- Thunder Client (VS Code extension)
- Insomnia

## Production Deployment

See deployment guides:
- Gateway: Railway, Render, Fly.io
- Frontend: Vercel, Netlify
- Redis: Redis Cloud, Upstash

---

Need help? Check the main README or create an issue!
