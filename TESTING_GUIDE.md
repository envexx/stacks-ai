# 🧪 Testing Guide - StacksAI Gateway

Comprehensive testing guide for StacksAI Gateway.

## Quick Test Checklist

- [ ] Gateway starts successfully
- [ ] Health endpoint responds
- [ ] 402 response works (no payment)
- [ ] Payment verification works
- [ ] AI response returns after payment
- [ ] Web demo loads
- [ ] Wallet connection works
- [ ] End-to-end payment flow works

## 1. Gateway API Testing

### Start the Gateway

```bash
cd packages/gateway
pnpm dev
```

### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

**Expected:**
```json
{
  "status": "healthy",
  "timestamp": "2024-02-10T10:00:00.000Z",
  "service": "StacksAI Gateway",
  "version": "1.0.0"
}
```

### Test 2: Get Available Models

```bash
curl http://localhost:3000/v1/prompt/models
```

**Expected:**
```json
{
  "models": {
    "gpt4": {
      "basePrice": 100000,
      "usdEquivalent": 0.20,
      "maxTokens": 2000,
      "description": "GPT-4 Turbo - Most capable model"
    },
    ...
  }
}
```

### Test 3: 402 Payment Required Response

```bash
curl -X POST http://localhost:3000/v1/prompt/gpt4 \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?"}'
```

**Expected (402 status):**
```json
{
  "status": 402,
  "error": "Payment Required",
  "payment": {
    "amount": 100000,
    "currency": "STX",
    "recipient": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    "network": "testnet",
    "resource": "/v1/prompt/gpt4",
    "nonce": "...",
    "estimatedCost": {
      "usd": 0.20,
      "stx": 0.1
    },
    "expires_in": 300
  },
  "instructions": {
    "step1": "Make STX transfer to the recipient address",
    "step2": "Include the transaction ID in X-Payment-Proof header",
    "step3": "Include the nonce in X-Payment-Nonce header",
    "step4": "Retry the request with payment proof"
  }
}
```

### Test 4: Invalid Payment Proof

```bash
curl -X POST http://localhost:3000/v1/prompt/gpt4 \
  -H "Content-Type: application/json" \
  -H "X-Payment-Proof: invalid-tx-id" \
  -H "X-Payment-Nonce: invalid-nonce" \
  -d '{"prompt": "Hello"}'
```

**Expected (403 status):**
```json
{
  "error": "Payment verification failed",
  "reason": "Nonce expired" // or other validation error
}
```

### Test 5: Stats Endpoint

```bash
curl http://localhost:3000/v1/stats
```

**Expected:**
```json
{
  "requests": 0,
  "payments": 0,
  "revenue": {
    "microSTX": 0,
    "STX": 0
  },
  "uptime": 123.456
}
```

## 2. SDK Testing

### Create Test Script

Create `test-sdk.js`:

```javascript
const { StacksAIClient } = require('@stacksai/sdk');

async function test() {
  const client = new StacksAIClient({
    gatewayUrl: 'http://localhost:3000'
  });

  try {
    // This will trigger 402 response
    const response = await client.prompt('gpt4', 'Say hello');
    console.log('Response:', response);
  } catch (error) {
    if (error.response?.status === 402) {
      console.log('✅ 402 Payment Required received');
      console.log('Payment info:', error.response.data.payment);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

test();
```

### Run Test

```bash
node test-sdk.js
```

## 3. Web Demo Testing

### Start Web Demo

```bash
cd packages/web-demo
pnpm dev
```

### Manual Testing Checklist

1. **Landing Page (http://localhost:3001)**
   - [ ] Page loads without errors
   - [ ] All sections visible
   - [ ] "Try Playground" button works
   - [ ] Navigation works

2. **Playground Page (http://localhost:3001/playground)**
   - [ ] Page loads
   - [ ] Model selection works
   - [ ] Prompt input works
   - [ ] "Connect Wallet" button visible

3. **Wallet Connection**
   - [ ] Click "Connect Wallet"
   - [ ] Hiro Wallet popup appears
   - [ ] Can approve connection
   - [ ] Wallet address shows after connection

4. **Prompt Submission**
   - [ ] Select a model
   - [ ] Enter a prompt
   - [ ] Click "Send Prompt"
   - [ ] Loading state shows
   - [ ] Demo response appears

## 4. End-to-End Payment Flow Testing

### Prerequisites

1. Hiro Wallet installed and configured
2. Testnet STX in wallet (get from faucet)
3. Gateway running with valid API keys

### Test Flow

1. **Start Services**
   ```bash
   # Terminal 1
   pnpm gateway:dev
   
   # Terminal 2
   pnpm web:dev
   ```

2. **Open Web Demo**
   - Go to http://localhost:3001/playground

3. **Connect Wallet**
   - Click "Connect Wallet"
   - Approve in Hiro Wallet

4. **Send Prompt**
   - Select GPT-4
   - Enter: "Explain quantum computing in one sentence"
   - Click "Send Prompt"

5. **Approve Payment**
   - Wallet popup appears
   - Review payment (0.1 STX)
   - Click "Confirm"

6. **Wait for Confirmation**
   - Transaction broadcasts
   - Wait 5-10 seconds for confirmation

7. **Receive Response**
   - AI response appears
   - Payment info shown

### Expected Result

```json
{
  "model": "gpt4",
  "response": "Quantum computing uses quantum bits...",
  "usage": {
    "promptTokens": 10,
    "completionTokens": 50,
    "totalTokens": 60
  },
  "payment": {
    "txId": "0x...",
    "amount": 100000,
    "sender": "ST...",
    "timestamp": 1707566400
  },
  "latency": 2500,
  "timestamp": "2024-02-10T10:00:00.000Z"
}
```

## 5. Load Testing (Optional)

### Simple Load Test

```bash
# Install Apache Bench
# Windows: Download from Apache website
# Mac: brew install ab
# Linux: sudo apt-get install apache2-utils

# Test 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:3000/health
```

### Expected Performance

- Health endpoint: < 50ms
- 402 response: < 100ms
- Payment verification: < 10s (depends on blockchain)
- AI response: 2-5s (depends on AI provider)

## 6. Error Scenarios Testing

### Test Missing API Key

1. Remove `OPENAI_API_KEY` from `.env`
2. Restart gateway
3. Try to send prompt
4. Should get error: "OpenAI API key not configured"

### Test Invalid Payment Address

1. Use wrong recipient address in payment
2. Should get: "Invalid recipient address"

### Test Expired Nonce

1. Get nonce from 402 response
2. Wait 6 minutes (nonce expires in 5 minutes)
3. Try to use expired nonce
4. Should get: "Nonce expired"

### Test Replay Attack

1. Complete a successful payment
2. Try to reuse the same txId and nonce
3. Should get: "Nonce already used (replay attack prevention)"

## 7. Integration Testing

### Test with Real Stacks Testnet

1. Get testnet STX from faucet
2. Make real payment on testnet
3. Verify transaction on explorer
4. Confirm gateway accepts payment
5. Receive AI response

### Verify on Stacks Explorer

1. Go to https://explorer.stacks.co/?chain=testnet
2. Search for your transaction ID
3. Verify:
   - Transaction status: Success
   - Amount: Correct
   - Recipient: Correct

## 8. Debugging Tips

### Enable Debug Logging

```env
# In .env
LOG_LEVEL=debug
```

### Check Gateway Logs

Look for:
- `💰 Payment required`
- `Verifying transaction: 0x...`
- `Transaction verified: 100000 STX from ST...`
- `✅ Payment confirmed!`

### Common Issues

**Issue: "Cannot connect to Redis"**
- Solution: Redis is optional, will use in-memory storage

**Issue: "Transaction not found"**
- Solution: Wait longer for blockchain confirmation

**Issue: "Insufficient payment"**
- Solution: Check amount sent matches required amount

**Issue: "API rate limit exceeded"**
- Solution: Wait or upgrade API plan

## Success Criteria

✅ All API endpoints respond correctly
✅ 402 payment flow works
✅ Payment verification succeeds
✅ AI responses return correctly
✅ Web demo functions properly
✅ Wallet integration works
✅ End-to-end flow completes successfully

## Next Steps

After successful testing:
1. Deploy to production
2. Monitor performance
3. Collect user feedback
4. Iterate and improve

---

Happy Testing! 🎉
