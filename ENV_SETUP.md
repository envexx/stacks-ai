# 🔧 Environment Variables Setup Guide

## Quick Setup

### 1. Frontend Environment Variables

Create file: `packages/web-demo/.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STACKS_NETWORK=testnet
```

**Important Notes:**
- Variables must start with `NEXT_PUBLIC_` to be accessible in browser
- Restart `pnpm dev` after creating/changing .env.local
- File is gitignored (safe for local development)

### 2. Backend Environment Variables

Your root `.env` file should have:

```bash
# Stacks Network Configuration
STACKS_NETWORK=testnet
PAYMENT_RECIPIENT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

# AI API Keys (at least one required)
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Redis (for production)
# REDIS_URL=redis://localhost:6379

# Server Port (optional, defaults to 3000)
PORT=3000
```

**⚠️ CRITICAL:** Replace `PAYMENT_RECIPIENT_ADDRESS` with YOUR Stacks testnet address!

---

## How to Get Your Stacks Address

1. **Install Hiro Wallet**: https://wallet.hiro.so/
2. **Create/Import Wallet**
3. **Switch to Testnet** in settings
4. **Copy Address** (starts with `ST...` for testnet)
5. **Paste into .env** as `PAYMENT_RECIPIENT_ADDRESS`

---

## Verification

### Check Frontend Can Access Variables

In browser console (http://localhost:3001/playground):

```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
// Should show: http://localhost:3000

console.log(process.env.NEXT_PUBLIC_STACKS_NETWORK)
// Should show: testnet
```

### Check Backend Variables

In `packages/gateway` terminal, you should see on startup:

```
🚀 StacksAI Gateway running on port 3000
📡 Network: testnet
💰 Payment recipient: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
```

---

## Troubleshooting

### Frontend shows "undefined" for API_URL

**Problem:** Environment variables not loaded

**Solution:**
1. Ensure file is named exactly `.env.local` (not `.env` or `env.local`)
2. Restart `pnpm dev` in `packages/web-demo`
3. Hard refresh browser (Ctrl+Shift+R)

### Backend shows "undefined" for PAYMENT_RECIPIENT_ADDRESS

**Problem:** .env file not in correct location

**Solution:**
1. Ensure `.env` is in project root: `c:\Users\HP\OneDrive\Dokumen\Program\hacktone\stack\.env`
2. Restart `pnpm dev` in `packages/gateway`

### 404 Error on API Calls

**Problem:** Frontend trying to access wrong URL

**Solution:**
1. Check `NEXT_PUBLIC_API_URL` is set correctly
2. Verify backend is running on port 3000: `netstat -ano | findstr :3000`
3. Test backend directly: `curl http://localhost:3000/health`

---

## Production Setup (When Ready)

### Frontend (.env.production)

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_STACKS_NETWORK=mainnet
```

### Backend (.env.production)

```bash
STACKS_NETWORK=mainnet
PAYMENT_RECIPIENT_ADDRESS=SP... # Your MAINNET address (starts with SP)
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
REDIS_URL=redis://your-redis-url:6379
PORT=3000
```

**⚠️ WARNING:**
- Mainnet uses REAL STX (has monetary value)
- Test thoroughly on testnet first
- Use different wallet address for mainnet
- Enable Redis for production (required for scaling)

---

## Environment Variable Reference

### Frontend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:3000` | Backend API URL |
| `NEXT_PUBLIC_STACKS_NETWORK` | Yes | `testnet` | Stacks network (testnet/mainnet) |

### Backend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STACKS_NETWORK` | Yes | `testnet` | Stacks network |
| `PAYMENT_RECIPIENT_ADDRESS` | Yes | - | Your Stacks address for receiving payments |
| `OPENAI_API_KEY` | No* | - | OpenAI API key for GPT models |
| `ANTHROPIC_API_KEY` | No* | - | Anthropic API key for Claude models |
| `REDIS_URL` | No | - | Redis connection URL (recommended for production) |
| `PORT` | No | `3000` | Server port |

*At least one AI API key is required

---

## Quick Commands

```bash
# Create frontend .env.local
cd packages/web-demo
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
echo "NEXT_PUBLIC_STACKS_NETWORK=testnet" >> .env.local

# Verify backend .env exists
cat ../../.env

# Start backend
cd ../gateway
pnpm dev

# Start frontend (new terminal)
cd ../web-demo
pnpm dev
```

---

## Security Best Practices

1. **Never commit .env files** to git (already in .gitignore)
2. **Use different API keys** for dev/prod
3. **Rotate API keys** regularly
4. **Use environment-specific addresses** (different wallets for testnet/mainnet)
5. **Enable Redis** in production for better security (nonce management)

---

Need help? Check `WALLET_TESTING_GUIDE.md` for complete testing instructions.
