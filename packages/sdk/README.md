# @stacksai/sdk

Official SDK for StacksAI Gateway - Pay-per-prompt AI access on Stacks blockchain.

## Installation

```bash
npm install @stacksai/sdk
```

## Quick Start

```typescript
import { StacksAIClient } from '@stacksai/sdk';

const client = new StacksAIClient({
  gatewayUrl: 'https://api.stacksai.xyz'
});

// Send a prompt - payment is handled automatically
const response = await client.prompt('gpt4', 'Explain quantum computing');
console.log(response.response);
```

## Features

- 🔄 Automatic payment handling
- 💰 Pay-per-use pricing
- 🔒 Secure blockchain verification
- ⚡ Multiple AI models (GPT-4, Claude, GPT-3.5)

## API

### `prompt(model, prompt, options?)`

Send a prompt to an AI model with automatic payment.

**Parameters:**
- `model`: 'gpt4' | 'claude' | 'gpt-3.5'
- `prompt`: Your prompt text
- `options`: Optional configuration
  - `maxTokens`: Maximum tokens in response
  - `temperature`: Creativity level (0-1)

**Returns:** `AIResponse` with model output and payment info

### `getModels()`

Get available models and pricing.

## License

MIT
