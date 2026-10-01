import {
  AIProvider,
  AIMessage,
  AIChatCompletionOptions,
  AIChatCompletionResponse,
  AIToolCall
} from '../types/gateway.js';
import { Logger } from '@ieab/shared';

export interface ModelGatewayConfig {
  defaultProvider?: AIProvider;
  defaultModel?: string;
  baseUrl?: string;
  apiKey?: string;
}

export class EnterpriseAIGateway {
  private config: ModelGatewayConfig;
  private logger = new Logger('AIGateway');

  constructor(config: ModelGatewayConfig = {}) {
    this.config = {
      defaultProvider: (process.env.AI_PROVIDER as AIProvider) || 'LOCAL_VLLM',
      defaultModel: process.env.AI_MODEL || 'qwen2.5-72b-instruct',
      baseUrl: process.env.AI_BASE_URL || 'http://localhost:8000/v1',
      apiKey: process.env.AI_API_KEY || 'local-key',
      ...config
    };
  }

  /**
   * Execute chat completion with support for tool calling across Cloud & On-Prem models.
   */
  public async chat(
    messages: AIMessage[],
    options: AIChatCompletionOptions = {}
  ): Promise<AIChatCompletionResponse> {
    const provider = options.provider || this.config.defaultProvider || 'LOCAL_VLLM';
    const model = options.model || this.config.defaultModel || 'qwen2.5-72b-instruct';
    const startTime = Date.now();

    // If external endpoint is available via standard fetch
    if (this.config.baseUrl && process.env.AI_ONLINE === 'true') {
      try {
        const res = await fetch(`${this.config.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.config.apiKey}`
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: options.temperature ?? 0.1,
            max_tokens: options.maxTokens ?? 2048,
            tools: options.tools
          })
        });

        if (res.ok) {
          const data: any = await res.json();
          const choice = data.choices?.[0];
          return {
            id: data.id || `chat-${Date.now()}`,
            provider,
            model,
            content: choice?.message?.content || null,
            toolCalls: choice?.message?.tool_calls,
            usage: data.usage,
            durationMs: Date.now() - startTime
          };
        }
      } catch (err: any) {
        this.logger.warn(`Remote AI endpoint error, falling back to embedded agent reasoning: ${err.message}`);
      }
    }

    // Embedded deterministic rule-based tool planner for fast and offline executive Q&A
    return this.simulateOrRuleBasedCompletion(messages, options, startTime, provider, model);
  }

  private simulateOrRuleBasedCompletion(
    messages: AIMessage[],
    options: AIChatCompletionOptions,
    startTime: number,
    provider: AIProvider,
    model: string
  ): AIChatCompletionResponse {
    const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || '';
    const lastToolMsg = messages.filter((m) => m.role === 'tool').pop()?.content;

    // If there is tool output, synthesize executive answer
    if (lastToolMsg) {
      return {
        id: `synth-${Date.now()}`,
        provider,
        model,
        content: null, // Agent runtime will assemble exact evidence response
        durationMs: Date.now() - startTime
      };
    }

    // Identify intent and invoke deterministic tool
    const toolCalls: AIToolCall[] = [];
    const lower = lastUserMsg.toLowerCase();

    if (lower.includes('فروش') || lower.includes('درآمد') || lower.includes('sales') || lower.includes('کم شده')) {
      toolCalls.push({
        id: `call_${Date.now()}`,
        type: 'function',
        function: {
          name: 'get_metric',
          arguments: JSON.stringify({ metricId: 'NET_SALES', breakdownBy: 'customer' })
        }
      });
    } else if (lower.includes('نقد') || lower.includes('بانک') || lower.includes('cash') || lower.includes('کسری')) {
      toolCalls.push({
        id: `call_${Date.now()}`,
        type: 'function',
        function: {
          name: 'get_metric',
          arguments: JSON.stringify({ metricId: 'CASH_POSITION' })
        }
      });
    } else if (lower.includes('مطالبات') || lower.includes('معوق') || lower.includes('طلب') || lower.includes('وصول')) {
      toolCalls.push({
        id: `call_${Date.now()}`,
        type: 'function',
        function: {
          name: 'get_metric',
          arguments: JSON.stringify({ metricId: 'OVERDUE_RECEIVABLES' })
        }
      });
    } else if (lower.includes('انبار') || lower.includes('موجودی') || lower.includes('کالا')) {
      toolCalls.push({
        id: `call_${Date.now()}`,
        type: 'function',
        function: {
          name: 'get_metric',
          arguments: JSON.stringify({ metricId: 'INVENTORY_VALUE' })
        }
      });
    } else if (lower.includes('تولید') || lower.includes('oee') || lower.includes('راندمان') || lower.includes('بهره‌وری')) {
      toolCalls.push({
        id: `call_${Date.now()}`,
        type: 'function',
        function: {
          name: 'get_metric',
          arguments: JSON.stringify({ metricId: 'OEE' })
        }
      });
    } else if (lower.includes('ضایعات') || lower.includes('افت') || lower.includes('scrap')) {
      toolCalls.push({
        id: `call_${Date.now()}`,
        type: 'function',
        function: {
          name: 'get_metric',
          arguments: JSON.stringify({ metricId: 'PRODUCTION_SCRAP_RATE' })
        }
      });
    } else if (lower.includes('توقف') || lower.includes('خرابی') || lower.includes('downtime')) {
      toolCalls.push({
        id: `call_${Date.now()}`,
        type: 'function',
        function: {
          name: 'get_metric',
          arguments: JSON.stringify({ metricId: 'MACHINE_DOWNTIME_HOURS' })
        }
      });
    } else if (lower.includes('استثنا') || lower.includes('ریسک') || lower.includes('هشدار') || lower.includes('انحراف')) {
      toolCalls.push({
        id: `call_${Date.now()}`,
        type: 'function',
        function: {
          name: 'get_anomalies',
          arguments: JSON.stringify({})
        }
      });
    } else {
      // Default fallback tool
      toolCalls.push({
        id: `call_${Date.now()}`,
        type: 'function',
        function: {
          name: 'get_metric',
          arguments: JSON.stringify({ metricId: 'NET_SALES' })
        }
      });
    }

    return {
      id: `rule-${Date.now()}`,
      provider,
      model,
      content: null,
      toolCalls,
      durationMs: Date.now() - startTime
    };
  }
}
