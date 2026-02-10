import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../../utils/logger';

export interface PromptOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface AIResponse {
  model: string;
  response: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latency: number;
  timestamp: string;
}

export class AIRouterService {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      logger.info('✅ OpenAI initialized');
    }

    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
      logger.info('✅ Anthropic initialized');
    }
  }

  async routePrompt(model: string, prompt: string, options?: PromptOptions): Promise<AIResponse> {
    const startTime = Date.now();

    try {
      let response;
      let tokensUsed;

      switch (model) {
        case 'gpt4':
          if (!this.openai) throw new Error('OpenAI API key not configured');
          response = await this.callOpenAI('gpt-4-turbo-preview', prompt, options);
          tokensUsed = response.usage;
          break;

        case 'claude':
          if (!this.anthropic) throw new Error('Anthropic API key not configured');
          response = await this.callAnthropic('claude-3-opus-20240229', prompt, options);
          tokensUsed = response.usage;
          break;

        case 'gpt-3.5':
          if (!this.openai) throw new Error('OpenAI API key not configured');
          response = await this.callOpenAI('gpt-3.5-turbo', prompt, options);
          tokensUsed = response.usage;
          break;

        default:
          throw new Error(`Unsupported model: ${model}`);
      }

      const latency = Date.now() - startTime;

      return {
        model,
        response: response.content,
        usage: tokensUsed,
        latency,
        timestamp: new Date().toISOString()
      };

    } catch (error: any) {
      logger.error(`AI routing failed for ${model}:`, error);
      throw new Error(`AI routing failed: ${error.message}`);
    }
  }

  private async callOpenAI(model: string, prompt: string, options?: PromptOptions) {
    const completion = await this.openai!.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: options?.maxTokens || 1000,
      temperature: options?.temperature || 0.7
    });

    return {
      content: completion.choices[0].message.content || '',
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0
      }
    };
  }

  private async callAnthropic(model: string, prompt: string, options?: PromptOptions) {
    const message = await this.anthropic!.messages.create({
      model,
      max_tokens: options?.maxTokens || 1000,
      messages: [{ role: 'user', content: prompt }]
    });

    return {
      content: message.content[0].type === 'text' ? message.content[0].text : '',
      usage: {
        promptTokens: message.usage.input_tokens,
        completionTokens: message.usage.output_tokens,
        totalTokens: message.usage.input_tokens + message.usage.output_tokens
      }
    };
  }
}
