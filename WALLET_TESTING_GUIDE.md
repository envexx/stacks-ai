# 🔐 Wallet Connection & Payment Testing Guide

## Prerequisites

### 1. Install Hiro Wallet (Recommended)
- **Download**: https://wallet.hiro.so/
- Install browser extension (Chrome/Firefox/Brave)
- Create new wallet or import existing
- **Switch to Testnet** in wallet settings

### 2. Get Testnet STX (Free)
1. Visit: https://explorer.hiro.so/sandbox/faucet?chain=testnet
2. Connect your Hiro Wallet
3. Click "Request STX"
4. Wait ~30 seconds for confirmation
5. Check balance in wallet (should have 500 STX)

---

## 🚀 Setup Environment Variables

### Frontend (.env.local in packages/web-demo)

Create file: `packages/web-demo/.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STACKS_NETWORK=testnet
```

### Backend (.env in root or packages/gateway)

Ensure these are set:

```bash
# Stacks Configuration
STACKS_NETWORK=testnet
PAYMENT_RECIPIENT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

# AI API Keys (at least one required)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Redis for production
# REDIS_URL=redis://localhost:6379
```

**⚠️ IMPORTANT**: Replace `PAYMENT_RECIPIENT_ADDRESS` with YOUR testnet address from Hiro Wallet!

---

## 🧪 Testing Flow

### Step 1: Start Backend
```bash
cd packages/gateway
pnpm dev
```

Expected output:
```
🚀 Server running on port 3000
✅ Services initialized
```

### Step 2: Start Frontend
```bash
cd packages/web-demo
pnpm dev
```

Expected output:
```
▲ Next.js 14.1.0
- Local:        http://localhost:3001
```

### Step 3: Open Playground
Navigate to: http://localhost:3001/playground

---

## 📋 Test Cases

### Test 1: Wallet Connection ✅

**Steps:**
1. Click "Connect Wallet" button (top right)
2. Hiro Wallet popup appears
3. Select account
4. Click "Connect"

**Expected Result:**
- Button changes to show address: `ST1PQ...PGZGM`
- "Disconnect" option appears

**Troubleshooting:**
- If no popup: Check if Hiro Wallet extension is installed
- If stuck: Refresh page and try again

---

### Test 2: Payment Required (402 Response) ✅

**Steps:**
1. Connect wallet (if not already)
2. Type a prompt: "Explain quantum computing"
3. Click Send button

**Expected Result:**
- Backend returns 402 status
- Console shows: `💰 Payment required: {...}`
- Payment info appears in header: `Payment: 0.1 STX`

**Check Response Format:**
```json
{
  "paymentRequirements": {
    "scheme": "exact",
    "network": "stacks:testnet",
    "asset": "STX",
    "payTo": "ST1PQ...",
    "amount": "100000",
    "resource": "/v1/prompt/gpt4",
    "nonce": "...",
    "description": "Payment for gpt4 AI model",
    "expiresAt": 1707567000000
  }
}
```

---

### Test 3: STX Payment Flow ✅

**Steps:**
1. After 402 response, wallet popup appears automatically
2. Review transaction details:
   - Recipient: Your payment address
   - Amount: 0.1 STX (100000 micro-STX)
   - Memo: "Payment for gpt4 AI model"
3. Click "Confirm" in wallet

**Expected Result:**
- Console shows: `✅ Payment sent: 0x123...`
- Status: `⏳ Waiting for confirmation...`
- Wait 30-60 seconds (testnet is slow)

**Troubleshooting:**
- If "Insufficient funds": Get more testnet STX from faucet
- If transaction fails: Check network is set to testnet
- If timeout: Testnet can be slow, increase wait time

---

### Test 4: Payment Verification ✅

**Steps:**
1. After payment confirmation
2. Frontend automatically retries request with `PAYMENT-SIGNATURE` header

**Expected Result:**
- Console shows: `✅ Payment confirmed! Retrying request...`
- Backend verifies payment
- AI response appears in chat

**Check Headers:**
```
PAYMENT-SIGNATURE: eyJwYXltZW50UmVxdWlyZW1lbnRzIjp7...
```

**Backend Verification:**
- Checks transaction on Stacks blockchain
- Verifies amount >= required
- Verifies recipient matches
- Checks nonce not reused
- Marks nonce as used

---

### Test 5: Complete E2E Flow ✅

**Full Flow:**
1. ✅ Connect Hiro Wallet
2. ✅ Enter prompt
3. ✅ Receive 402 Payment Required
4. ✅ Wallet popup for payment
5. ✅ Confirm payment (0.1 STX)
6. ✅ Wait for blockchain confirmation
7. ✅ Auto-retry with payment proof
8. ✅ Receive AI response
9. ✅ Message appears in chat

**Expected Timeline:**
- Wallet connection: ~5 seconds
- 402 response: instant
- Payment broadcast: ~2 seconds
- Blockchain confirmation: 30-60 seconds (testnet)
- AI response: 2-5 seconds
- **Total: ~40-70 seconds**

---

## 🔍 Debugging

### Check Backend Logs

```bash
# In packages/gateway terminal
# You should see:
💰 Payment required { model: 'gpt4', amount: 100000, ... }
✅ Payment verified { txId: '0x...', amount: 100000, sender: 'ST...' }
```

### Check Frontend Console

```javascript
// Open browser DevTools (F12)
// Console tab should show:
💰 Payment required: { scheme: 'exact', network: 'stacks:testnet', ... }
✅ Payment sent: 0x123abc...
⏳ Waiting for confirmation...
✅ Payment confirmed! Retrying request...
```

### Check Network Tab

**First Request (402):**
```
POST /v1/prompt/gpt4
Status: 402 Payment Required
Response: { paymentRequirements: {...} }
```

**Second Request (with payment):**
```
POST /v1/prompt/gpt4
Headers: PAYMENT-SIGNATURE: eyJ...
Status: 200 OK
Response: { response: "...", payment: {...} }
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Please connect your wallet first"
**Solution:** Click "Connect Wallet" button and approve in Hiro Wallet

### Issue 2: "Insufficient funds"
**Solution:** Get testnet STX from faucet: https://explorer.hiro.so/sandbox/faucet?chain=testnet

### Issue 3: "Transaction confirmation timeout"
**Cause:** Testnet can be slow
**Solution:** 
- Wait longer (up to 2 minutes)
- Check transaction on explorer: https://explorer.hiro.so/?chain=testnet
- Paste txId to see status

### Issue 4: "Payment verification failed"
**Possible Causes:**
- Wrong recipient address in .env
- Transaction not confirmed yet
- Insufficient amount sent
- Network mismatch (mainnet vs testnet)

**Solution:**
```bash
# Check .env file
echo $PAYMENT_RECIPIENT_ADDRESS
# Should match your wallet address

# Check transaction on explorer
# Verify: status=success, amount>=100000, recipient matches
```

### Issue 5: "Nonce already used"
**Cause:** Trying to reuse same payment proof
**Solution:** Make a new payment (this is security feature - replay protection)

### Issue 6: Wallet popup doesn't appear
**Solution:**
- Check if Hiro Wallet extension is installed
- Check browser console for errors
- Try refreshing page
- Disable other wallet extensions (MetaMask, etc.)

---

## 📊 Verify Payment on Blockchain

### Using Hiro Explorer

1. Copy transaction ID from console
2. Visit: https://explorer.hiro.so/?chain=testnet
3. Paste txId in search
4. Check:
   - ✅ Status: Success
   - ✅ Type: Token Transfer (STX)
   - ✅ Amount: 0.1 STX (100000 micro-STX)
   - ✅ Sender: Your address
   - ✅ Recipient: Payment address from .env

### Using API

```bash
# Check transaction status
curl https://api.testnet.hiro.so/extended/v1/tx/0x123abc...

# Response should show:
{
  "tx_status": "success",
  "tx_type": "token_transfer",
  "token_transfer": {
    "recipient_address": "ST1PQ...",
    "amount": "100000"
  }
}
```

---

## 🎯 Success Criteria

### ✅ All Tests Pass

- [x] Wallet connects successfully
- [x] 402 response with correct paymentRequirements format
- [x] Payment popup appears with correct details
- [x] Payment broadcasts to blockchain
- [x] Transaction confirms on-chain
- [x] Backend verifies payment correctly
- [x] AI response received
- [x] Message displays in chat

### ✅ x402-stacks Compliance

- [x] Uses `PAYMENT-SIGNATURE` header (not X-Payment-Proof)
- [x] PaymentRequirements follows exact specification
- [x] CAIP-2 network identifier: `stacks:testnet`
- [x] Payment scheme: `exact`
- [x] Nonce replay protection works
- [x] Expiration time enforced

---

## 📝 Test Report Template

```markdown
## Test Report - [Date]

### Environment
- Backend: Running on port 3000
- Frontend: Running on port 3001
- Network: Testnet
- Wallet: Hiro Wallet v[version]

### Test Results

#### 1. Wallet Connection
- Status: ✅ Pass / ❌ Fail
- Time: X seconds
- Notes: 

#### 2. Payment Required (402)
- Status: ✅ Pass / ❌ Fail
- Response format: ✅ Correct / ❌ Incorrect
- Notes:

#### 3. STX Payment
- Status: ✅ Pass / ❌ Fail
- TxId: 0x...
- Confirmation time: X seconds
- Notes:

#### 4. Payment Verification
- Status: ✅ Pass / ❌ Fail
- Verification time: X seconds
- Notes:

#### 5. AI Response
- Status: ✅ Pass / ❌ Fail
- Response quality: Good / Fair / Poor
- Notes:

### Issues Found
1. [Issue description]
2. [Issue description]

### Recommendations
1. [Recommendation]
2. [Recommendation]
```

---

## 🚀 Next Steps After Testing

1. **Switch to Mainnet** (when ready for production)
   ```bash
   # Update .env files
   NEXT_PUBLIC_STACKS_NETWORK=mainnet
   STACKS_NETWORK=mainnet
   PAYMENT_RECIPIENT_ADDRESS=SP... # Your mainnet address
   ```

2. **Add More Models**
   - Configure Claude API key
   - Test with different models
   - Verify pricing for each

3. **Performance Testing**
   - Test with multiple concurrent users
   - Measure response times
   - Optimize payment confirmation polling

4. **Security Audit**
   - Review nonce management
   - Test replay attack prevention
   - Verify payment amounts

5. **User Experience**
   - Add better loading states
   - Improve error messages
   - Add transaction history

---

## 📞 Support

If you encounter issues:
1. Check console logs (both frontend and backend)
2. Verify environment variables
3. Check Stacks testnet status: https://status.hiro.so
4. Review transaction on explorer
5. Check this guide's troubleshooting section

---

**Happy Testing! 🎉**
