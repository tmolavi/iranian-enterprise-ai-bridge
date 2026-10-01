export type AIProvider = 'LOCAL_VLLM' | 'LOCAL_OLLAMA' | 'OPENAI' | 'ANTHROPIC' | 'GEMINI';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_call_id?: string;
}

export interface AIToolFunction {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface AIToolDeclaration {
  type: 'function';
  function: AIToolFunction;
}

export interface AIToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface AIChatCompletionOptions {
  model?: string;
  provider?: AIProvider;
  temperature?: number;
  maxTokens?: number;
  tools?: AIToolDeclaration[];
  stream?: boolean;
}

export interface AIChatCompletionResponse {
  id: string;
  provider: AIProvider;
  model: string;
  content: string | null;
  toolCalls?: AIToolCall[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  durationMs: number;
}
