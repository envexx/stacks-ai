# 🚀 StacksAI - Pay-per-Prompt AI on Stacks Blockchain

<div align="center">

![StacksAI Banner](https://img.shields.io/badge/Stacks-Blockchain-5546FF?style=for-the-badge&logo=bitcoin&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Access premium AI models like GPT-4 and Claude with blockchain-verified micro-payments**

[Live Demo](https://stacksai.vercel.app) • [Documentation](./DEPLOYMENT.md) • [Stacks Blockchain](https://www.stacks.co/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Why StacksAI?](#-why-stacksai)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Benefits for Stacks Ecosystem](#-benefits-for-stacks-ecosystem)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🌟 Overview

**StacksAI** is a decentralized AI access platform built on the [Stacks blockchain](https://www.stacks.co/) that enables users to access premium AI models (GPT-4, Claude 3, GPT-3.5) through blockchain-verified micro-payments. Instead of traditional subscription models, users pay only for what they use - as low as $0.04 per prompt.

### What is Stacks?

[Stacks](https://www.stacks.co/) is a Bitcoin layer that enables smart contracts and decentralized applications while leveraging Bitcoin's security. Stacks uses a unique Proof of Transfer (PoX) consensus mechanism that anchors to Bitcoin, making it the most secure smart contract platform available.

---

## 💡 Why StacksAI?

### The Problem

Traditional AI API services suffer from several limitations:

1. **Subscription Lock-in**: Users must commit to monthly subscriptions regardless of actual usage
2. **Centralized Payment**: Credit cards and traditional payment methods exclude billions globally
3. **Lack of Transparency**: No verifiable proof of payment or usage
4. **High Barriers**: Minimum commitments and complex billing structures
5. **Privacy Concerns**: Centralized platforms store payment and usage data

### Our Solution

StacksAI leverages the Stacks blockchain to create a **trustless, transparent, and accessible** AI access platform:

- ✅ **Pay-per-Prompt**: Only pay for what you actually use (starting at $0.04)
- ✅ **Blockchain Verified**: Every payment is recorded on-chain with immutable proof
- ✅ **Global Access**: Anyone with STX tokens can access premium AI models
- ✅ **No Subscriptions**: No monthly fees, no commitments, no hidden costs
- ✅ **Privacy First**: Decentralized payments, no stored credit card data
- ✅ **Bitcoin Security**: Inherits Bitcoin's security through Stacks

### Why Built on Stacks?

We chose Stacks for several critical reasons:

1. **Bitcoin Security**: Stacks transactions settle on Bitcoin, providing unmatched security
2. **Smart Contract Capability**: Clarity smart contracts enable complex payment logic
3. **Proof of Transfer**: Unique consensus mechanism that doesn't waste energy
4. **Growing Ecosystem**: Active developer community and robust infrastructure
5. **STX Token Utility**: Native token for payments and gas fees
6. **Interoperability**: Seamless integration with Bitcoin and other chains

---

## ✨ Key Features

### 🤖 Multiple AI Models

Access industry-leading AI models with transparent pricing:

- **GPT-4 Turbo**: Most advanced reasoning (0.10 STX/prompt)
- **Claude 3 Opus**: Long context, detailed analysis (0.12 STX/prompt)
- **GPT-3.5 Turbo**: Fast, efficient responses (0.02 STX/prompt)

### 🔐 Blockchain-Verified Payments

- Every payment is recorded on the Stacks blockchain
- Immutable proof of transaction
- Transparent pricing with no hidden fees
- Automatic payment verification through smart contracts

### ⚡ Instant Access

- Connect your Stacks wallet (Hiro Wallet)
- Pay with STX tokens
- Get AI responses in seconds
- No registration, no KYC, no waiting

### 🌍 Global Accessibility

- Available to anyone with internet access
- No geographic restrictions
- No credit card required
- Support for testnet (free testing) and mainnet

### 🛡️ Privacy & Security

- No personal data collection
- Decentralized payment processing
- End-to-end encryption
- Non-custodial wallet integration

---

## 🏗️ Architecture

StacksAI is built as a modern monorepo with three main packages:

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│              (Next.js 15 + React + TailwindCSS)         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/REST API
                     │
┌────────────────────▼────────────────────────────────────┐
│                 API Gateway                              │
│         (Express.js + TypeScript)                        │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   X402        │  │  AI Router   │  │   Payment    │ │
│  │  Middleware   │  │   Service    │  │  Verifier    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│   OpenAI     │ │ Anthropic│ │    Stacks    │
│   API        │ │   API    │ │  Blockchain  │
└──────────────┘ └──────────┘ └──────────────┘
```

### Payment Flow (X402 Protocol)

1. **User Request**: User sends prompt to API Gateway
2. **402 Response**: Gateway returns payment requirements (amount, recipient, nonce)
3. **STX Payment**: User approves payment in Hiro Wallet
4. **Blockchain Verification**: Gateway verifies transaction on Stacks blockchain
5. **AI Processing**: Upon verification, prompt is sent to AI provider
6. **Response Delivery**: AI response returned to user

This implements the **X402 Payment Required** HTTP status code for blockchain-based payments.

---

## 🌐 Benefits for Stacks Ecosystem

StacksAI contributes to the Stacks ecosystem in several meaningful ways:

### 1. **Real-World Use Case**

Demonstrates practical application of Stacks for everyday services beyond DeFi, showing how blockchain can improve traditional SaaS models.

### 2. **STX Token Utility**

Creates genuine demand for STX tokens as the payment method for AI services, increasing token utility and circulation.

### 3. **Developer Reference**

Provides open-source implementation of:
- X402 payment protocol on Stacks
- Wallet integration patterns
- Smart contract payment verification
- Micro-payment architecture

### 4. **User Onboarding**

Introduces new users to Stacks through a familiar use case (AI chat), lowering the barrier to blockchain adoption.

### 5. **Bitcoin-Secured AI**

Showcases how Bitcoin's security (via Stacks) can protect high-value transactions in AI services, a growing trillion-dollar industry.

### 6. **Ecosystem Growth**

- Increases transaction volume on Stacks network
- Demonstrates scalability for micro-payments
- Attracts AI/ML developers to Stacks ecosystem
- Creates blueprint for other pay-per-use services

### 7. **Interoperability Example**

Shows how Stacks can bridge traditional Web2 services (AI APIs) with Web3 infrastructure, demonstrating the "Bitcoin economy" vision.

---

## 🛠️ Tech Stack

### Frontend (`packages/web-demo`)

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Magic UI components
- **Blockchain**: @stacks/connect, @stacks/transactions
- **State Management**: React Hooks
- **Animations**: Framer Motion

### Backend (`packages/gateway`)

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **AI Providers**: OpenAI API, Anthropic API
- **Blockchain**: @stacks/blockchain-api-client
- **Caching**: Redis (optional)
- **Payment Protocol**: Custom X402 implementation

### SDK (`packages/sdk`)

- **Language**: TypeScript
- **Purpose**: JavaScript/TypeScript SDK for developers
- **Features**: Automatic payment handling, type-safe API

### Infrastructure

- **Monorepo**: Turborepo + pnpm workspaces
- **Deployment**: Vercel (frontend), Railway (backend)
- **Blockchain**: Stacks Testnet/Mainnet
- **Wallet**: Hiro Wallet integration

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Hiro Wallet browser extension
- STX tokens (testnet or mainnet)
- OpenAI API key (for backend)

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/envexx/stacks-ai.git
cd stacks-ai
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
# Backend (.env in packages/gateway)
cp packages/gateway/.env.example packages/gateway/.env

# Add your API keys:
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
PAYMENT_RECIPIENT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
STACKS_NETWORK=testnet
```

```bash
# Frontend (.env.local in packages/web-demo)
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STACKS_NETWORK=testnet
```

4. **Start development servers**

```bash
# Start all services (frontend + backend)
pnpm dev

# Or start individually:
pnpm dev:gateway  # Backend on http://localhost:3000
pnpm dev:web      # Frontend on http://localhost:3001
```

5. **Get testnet STX**

Visit [Stacks Testnet Faucet](https://explorer.hiro.so/sandbox/faucet) to get free testnet STX tokens.

6. **Open the app**

Navigate to `http://localhost:3001` and connect your Hiro Wallet!

---

## 📁 Project Structure

```
stacks-ai/
├── packages/
│   ├── gateway/              # Backend API Gateway
│   │   ├── src/
│   │   │   ├── middleware/   # X402 payment middleware
│   │   │   ├── services/     # AI routing, payment verification
│   │   │   ├── routes/       # API endpoints
│   │   │   └── config/       # Configuration
│   │   └── package.json
│   │
│   ├── web-demo/             # Frontend Next.js App
│   │   ├── src/
│   │   │   ├── app/          # Next.js pages (/, /chat, /docs, /features)
│   │   │   ├── components/   # React components + Magic UI
│   │   │   ├── hooks/        # Wallet & payment hooks
│   │   │   └── lib/          # Utilities
│   │   ├── public/           # Static assets
│   │   └── package.json
│   │
│   └── sdk/                  # JavaScript SDK
│       ├── src/
│       │   ├── client.ts     # Main SDK client
│       │   └── types/        # TypeScript types
│       └── package.json
│
├── scripts/                  # Utility scripts
├── DEPLOYMENT.md            # Deployment guide
├── README.md                # This file
└── package.json             # Root package.json
```

---

## 🌍 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set root directory to `packages/web-demo`
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL
   - `NEXT_PUBLIC_STACKS_NETWORK`: `testnet` or `mainnet`
4. Deploy!

### Backend (Railway/Render)

1. Connect your GitHub repository
2. Set root directory to `packages/gateway`
3. Add environment variables (see [DEPLOYMENT.md](./DEPLOYMENT.md))
4. Deploy!

**Detailed deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive instructions.

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- TypeScript for all code
- ESLint + Prettier for formatting
- Conventional Commits for commit messages
- Write tests for new features

---

## 📚 Documentation

- **[Deployment Guide](./DEPLOYMENT.md)**: Complete deployment instructions
- **[X402 Integration Guide](./X402_INTEGRATION_GUIDE.md)**: Payment protocol details
- **[Testing Guide](./TESTING_GUIDE.md)**: How to test the application
- **[Wallet Testing Guide](./WALLET_TESTING_GUIDE.md)**: Wallet integration testing

---

## 🔗 Links

- **Stacks Blockchain**: [https://www.stacks.co/](https://www.stacks.co/)
- **Stacks Documentation**: [https://docs.stacks.co/](https://docs.stacks.co/)
- **Hiro Wallet**: [https://wallet.hiro.so/](https://wallet.hiro.so/)
- **Stacks Explorer**: [https://explorer.hiro.so/](https://explorer.hiro.so/)
- **OpenAI API**: [https://platform.openai.com/](https://platform.openai.com/)
- **Anthropic API**: [https://www.anthropic.com/](https://www.anthropic.com/)

---

## 📊 Roadmap

- [x] Core payment infrastructure (X402 protocol)
- [x] Multi-model AI support (GPT-4, Claude, GPT-3.5)
- [x] Wallet integration (Hiro Wallet)
- [x] Modern UI with Magic UI components
- [ ] Smart contract for automated payments
- [ ] Additional AI models (Gemini, LLaMA)
- [ ] Usage analytics dashboard
- [ ] API rate limiting and quotas
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Stacks Foundation** for building the Bitcoin layer
- **Hiro Systems** for excellent developer tools
- **OpenAI & Anthropic** for AI API access
- **Magic UI** for beautiful components
- **Vercel** for hosting infrastructure

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/envexx/stacks-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/envexx/stacks-ai/discussions)
- **Twitter**: [@StacksAI](https://twitter.com/stacksai)
- **Discord**: [Stacks Discord](https://discord.gg/stacks)

---

<div align="center">

**Built with ❤️ on [Stacks](https://www.stacks.co/) • Secured by Bitcoin**

⭐ Star us on GitHub — it motivates us a lot!

[Report Bug](https://github.com/envexx/stacks-ai/issues) • [Request Feature](https://github.com/envexx/stacks-ai/issues) • [Documentation](./DEPLOYMENT.md)

</div>
