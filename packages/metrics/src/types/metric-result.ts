import { FormattedExecutiveAmount } from '@ieab/shared';

export interface DimensionalBreakdownItem {
  dimensionKey: string;
  dimensionLabelFa: string;
  value: number;
  percentageOfTotal: number;
  formattedFa: string;
  changeRatePercent?: number;
}

export interface MetricExecutionResult {
  metricId: string;
  titleFa: string;
  titleEn: string;
  value: number;
  unitFa: string;
  unitEn: string;
  periodFa: string; // e.g., 'مهر ۱۴۰۳'
  previousPeriodValue?: number;
  changeRatePercent?: number; // e.g. -12.4%
  executiveFormatted: FormattedExecutiveAmount;
  breakdown?: DimensionalBreakdownItem[];
  formulaUsedFa: string;
  sourceSystem: string;
  lastRefreshDate: string;
  reconciliationStatus: 'RECONCILED' | 'UNRECONCILED' | 'PENDING' | 'NOT_APPLICABLE';
  reconciliationDiffRial?: number;
  sampleSourcePks: string[];
}

export interface MetricQueryFilter {
  orgId: string;
  startDateJalali?: string;
  endDateJalali?: string;
  customerId?: string;
  productId?: string;
  warehouseId?: string;
  branchId?: string;
  costCenterId?: string;
  breakdownBy?: string;
}
