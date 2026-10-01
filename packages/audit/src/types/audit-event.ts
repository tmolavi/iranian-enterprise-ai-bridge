export interface ToolCallAuditRecord {
  toolName: string;
  arguments: Record<string, unknown>;
  executionDurationMs: number;
  success: boolean;
  recordsCount?: number;
  error?: string;
}

export interface ExecutiveInteractionAuditEvent {
  id: string;
  orgId: string;
  userId: string;
  userFullNameFa: string;
  userRole: string;
  timestamp: string;
  promptFa: string;
  modelId: string;
  modelProvider: 'LOCAL_VLLM' | 'LOCAL_OLLAMA' | 'OPENAI' | 'ANTHROPIC' | 'GEMINI';
  intentCategory: string;
  toolCalls: ToolCallAuditRecord[];
  metricsQueried: string[];
  reconciliationStatus: 'RECONCILED' | 'UNRECONCILED' | 'NOT_APPLICABLE';
  sourceSystemReferences: string[];
  finalAnswerFa: string;
  executionDurationTotalMs: number;
  clientIp?: string;
}
