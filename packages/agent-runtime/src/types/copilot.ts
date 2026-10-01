import { FormattedExecutiveAmount } from '@ieab/shared';
import { DimensionalBreakdownItem, MetricExecutionResult } from '@ieab/metrics';
import { EnterpriseRole } from '@ieab/policy-engine';

export interface CopilotUserContext {
  userId: string;
  fullNameFa: string;
  role: EnterpriseRole;
  orgId: string;
}

export interface CopilotEvidencePayload {
  metricId?: string;
  metricTitleFa?: string;
  exactValue?: number;
  unitFa?: string;
  periodFa?: string;
  executiveFormatted?: FormattedExecutiveAmount;
  breakdown?: DimensionalBreakdownItem[];
  formulaUsedFa?: string;
  sourceSystem: string;
  lastRefreshDate: string;
  reconciliationStatus: 'RECONCILED' | 'UNRECONCILED' | 'PENDING' | 'NOT_APPLICABLE';
  reconciliationDiffRial?: number;
  sampleSourcePks?: string[];
  drillDownAllowed: boolean;
}

export interface ExecutiveAnswer {
  conversationId: string;
  promptFa: string;
  intent: string;
  executiveSummaryFa: string;
  keyDriversFa: string[];
  recommendedActionsFa: string[];
  evidence: CopilotEvidencePayload;
  executionDurationMs: number;
  modelUsed: string;
  reconciled: boolean;
}
