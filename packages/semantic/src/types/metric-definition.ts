/**
 * Formal Metric Contract Specification for Semantic Layer.
 * Defines authoritative KPI formulas governed by CFO / COO.
 */

export type MetricDomain =
  | 'FINANCE'
  | 'TREASURY'
  | 'SALES'
  | 'INVENTORY'
  | 'PROCUREMENT'
  | 'MANUFACTURING'
  | 'QUALITY'
  | 'MAINTENANCE'
  | 'HR';

export type MetricDataType = 'CURRENCY_RIAL' | 'CURRENCY_TOMAN' | 'PERCENTAGE' | 'COUNT' | 'DURATION_HOURS' | 'RATIO';

export type TimeGrain = 'DAILY' | 'MONTHLY_JALALI' | 'QUARTERLY_JALALI' | 'YEARLY_JALALI';

export interface MetricDimension {
  id: string;
  nameFa: string;
  nameEn: string;
  sourceEntity: string;
  sourceField: string;
}

export interface MetricDefinition {
  id: string; // e.g. 'NET_REVENUE', 'GROSS_MARGIN', 'OEE', 'CASH_POSITION'
  titleFa: string;
  titleEn: string;
  descriptionFa: string;
  descriptionEn?: string;
  domain: MetricDomain;
  dataType: MetricDataType;
  unitFa: string;
  unitEn: string;
  ownerRole: 'CFO' | 'COO' | 'COMMERCIAL_DIRECTOR' | 'CEO' | 'HR_DIRECTOR';
  formulaExplanationFa: string;
  formulaExpression: string;
  sourceEntities: string[];
  dimensions: MetricDimension[];
  defaultTimeGrain: TimeGrain;
  version: string;
  effectiveDateJalali: string;
  approvalStatus: 'DRAFT' | 'APPROVED' | 'DEPRECATED';
  approvedBy?: string;
  requiresReconciliation: boolean;
}
