# ⚡ Quick Start - StacksAI Gateway

Get up and running in 5 minutes!

## 🚀 Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp env.example .env

# 3. Edit .env file with your configuration
# - Add your OpenAI API key
# - Add your Anthropic API key (optional)
# - Set your Stacks wallet address as payment recipient
```

## 🔑 Required Configuration

Edit `.env`:

```env
STACKS_NETWORK=testnet
PAYMENT_RECIPIENT_ADDRESS=YOUR_STACKS_ADDRESS_HERE
OPENAI_API_KEY=sk-your-openai-key-here
```

## ▶️ Run the Project

```bash
# Start everything (gateway + web demo)
pnpm dev
```

This will start:
- **Gateway API**: http://localhost:3000
- **Web Demo**: http://localhost:3001

## ✅ Verify It's Working

### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

Should return:
```json
{"status": "healthy", ...}
```

### Test 2: Try 402 Payment Flow

```bash
curl -X POST http://localhost:3000/v1/prompt/gpt4 \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello"}'
```

Should return **402 Payment Required** with payment instructions.

### Test 3: Open Web Demo

1. Go to http://localhost:3001
2. Click "Try Playground"
3. You should see the AI playground interface

## 🎯 Next Steps

1. **Get Testnet STX**: https://explorer.stacks.co/sandbox/faucet
2. **Install Hiro Wallet**: https://wallet.hiro.so/
3. **Try the full payment flow** in the web demo
4. **Read the full documentation** in `PROJECT_README.md`

## 🧪 Run Tests

```bash
# Test the gateway
cd scripts
pnpm install
node test-gateway.js
```

## 📚 Documentation

- **Full Setup Guide**: `SETUP_GUIDE.md`
- **Testing Guide**: `TESTING_GUIDE.md`
- **Project README**: `PROJECT_README.md`

## 🆘 Troubleshooting

**Port already in use?**
```env
# Change port in .env
PORT=3002
```

**Module not found?**
```bash
pnpm install
```

**TypeScript errors?**
These are expected before running `pnpm install`. They will resolve after installation.

---

**Ready to build the future of AI payments? Let's go! 🚀**
