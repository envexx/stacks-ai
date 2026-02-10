# 🚀 StacksAI Gateway

**Pay-per-Prompt AI Access on Stacks Blockchain**

A revolutionary AI gateway that enables pay-per-use access to premium AI models (GPT-4, Claude, GPT-3.5) using micro-payments on the Stacks blockchain. Built with the x402 payment protocol.

## 🎯 Value Proposition

- 💰 **Pay-per-use**: No subscriptions, only pay for what you use
- 🤖 **Machine-to-Machine**: Perfect for AI agents accessing other AI services
- 🔒 **Blockchain Verified**: All payments verified on-chain for transparency
- ⚡ **Instant Access**: Get AI responses immediately after payment confirmation
- 🌐 **Multiple Models**: Access GPT-4, Claude, and GPT-3.5 through one gateway

## 📦 Project Structure

```
stacksai-gateway/
├── packages/
│   ├── gateway/          # Express API Gateway with x402 middleware
│   ├── sdk/              # Client SDK for easy integration
│   └── web-demo/         # Next.js frontend demo
├── package.json          # Monorepo configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Redis (optional, falls back to in-memory)

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp env.example .env
# Edit .env with your API keys and configuration
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Gateway Configuration
PORT=3000
NODE_ENV=development

# Stacks Network
STACKS_NETWORK=testnet
PAYMENT_RECIPIENT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

# AI Provider API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

### Running the Project

```bash
# Run all packages in development mode
pnpm dev

# Or run individually
pnpm gateway:dev    # Start gateway on port 3000
pnpm web:dev        # Start web demo on port 3001
```

## 💡 How It Works

### 1. Client Makes Request (No Payment)

```bash
curl http://localhost:3000/v1/prompt/gpt4 \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain quantum computing"}'
```

### 2. Gateway Returns 402 Payment Required

```json
{
  "status": 402,
  "error": "Payment Required",
  "payment": {
    "amount": 100000,
    "currency": "STX",
    "recipient": "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
    "nonce": "abc123...",
    "estimatedCost": {
      "usd": 0.20,
      "stx": 0.1
    }
  }
}
```

### 3. Client Makes Payment on Stacks

Client sends STX to the recipient address and gets a transaction ID.

### 4. Client Retries with Payment Proof

```bash
curl http://localhost:3000/v1/prompt/gpt4 \
  -H "Content-Type: application/json" \
  -H "X-Payment-Proof: 0x123abc..." \
  -H "X-Payment-Nonce: abc123..." \
  -d '{"prompt": "Explain quantum computing"}'
```

### 5. Gateway Verifies & Returns AI Response

```json
{
  "model": "gpt4",
  "response": "Quantum computing is...",
  "usage": {
    "promptTokens": 10,
    "completionTokens": 150,
    "totalTokens": 160
  },
  "payment": {
    "txId": "0x123abc...",
    "amount": 100000,
    "sender": "ST2...",
    "timestamp": 1707566400
  }
}
```

## 🛠️ Using the SDK

```typescript
import { StacksAIClient } from '@stacksai/sdk';

const client = new StacksAIClient({
  gatewayUrl: 'http://localhost:3000'
});

// SDK handles payment automatically
const response = await client.prompt('gpt4', 'Explain quantum computing');
console.log(response.response);
```

## 💰 Pricing

| Model | Price per Prompt | USD Equivalent |
|-------|-----------------|----------------|
| GPT-4 Turbo | 0.1 STX | ~$0.20 |
| Claude 3 Opus | 0.12 STX | ~$0.24 |
| GPT-3.5 Turbo | 0.02 STX | ~$0.04 |

## 🏗️ Architecture

### Core Components

1. **X402 Middleware**: Enforces payment before AI access
2. **Payment Verifier**: Verifies transactions on Stacks blockchain
3. **Nonce Manager**: Prevents replay attacks
4. **AI Router**: Routes requests to appropriate AI provider
5. **Client SDK**: Simplifies integration with auto-payment handling

### Payment Flow

```
Client Request → 402 Response → STX Payment → Payment Verification → AI Response
```

## 🧪 Testing

### Manual Testing

1. Start the gateway:
```bash
cd packages/gateway
pnpm dev
```

2. Test 402 response:
```bash
curl http://localhost:3000/v1/prompt/gpt4 \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello"}'
```

3. Check health endpoint:
```bash
curl http://localhost:3000/health
```

### Using the Web Demo

1. Start the web demo:
```bash
cd packages/web-demo
pnpm dev
```

2. Open http://localhost:3001
3. Connect your Stacks wallet
4. Try sending a prompt

## 📚 API Documentation

### Endpoints

#### `POST /v1/prompt/:model`

Send a prompt to an AI model.

**Parameters:**
- `model`: 'gpt4' | 'claude' | 'gpt-3.5'

**Headers:**
- `X-Payment-Proof`: Transaction ID (required after 402)
- `X-Payment-Nonce`: Nonce from 402 response (required after 402)

**Body:**
```json
{
  "prompt": "Your prompt here",
  "maxTokens": 1000,
  "temperature": 0.7
}
```

#### `GET /v1/prompt/models`

Get available models and pricing.

#### `GET /health`

Health check endpoint.

#### `GET /v1/stats`

Get gateway statistics.

## 🔐 Security Features

- **Nonce-based replay attack prevention**
- **On-chain payment verification**
- **Rate limiting** (configurable)
- **CORS protection**
- **Input validation with Zod**

## 🚢 Deployment

### Gateway Deployment

Recommended platforms:
- Railway.app
- Render
- Fly.io

### Frontend Deployment

```bash
cd packages/web-demo
pnpm build
# Deploy to Vercel, Netlify, or similar
```

## 📝 Development Roadmap

- [x] Core x402 middleware
- [x] Payment verification on Stacks
- [x] AI routing (OpenAI, Anthropic)
- [x] Client SDK
- [x] Web demo
- [ ] Clarity smart contracts
- [ ] Dynamic pricing based on token usage
- [ ] Streaming responses
- [ ] Usage analytics dashboard
- [ ] CLI tool

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🙏 Acknowledgments

Built for the Stacks blockchain hackathon. Powered by:
- Stacks blockchain
- OpenAI & Anthropic
- Express.js & Next.js

---

**Built with ❤️ on Stacks**
