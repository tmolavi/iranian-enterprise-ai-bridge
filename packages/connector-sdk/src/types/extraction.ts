import { BaseCanonicalEntity } from '@ieab/canonical-model';

export interface ConnectionConfig {
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  baseUrl?: string;
  readOnlyIntent?: boolean;
  options?: Record<string, unknown>;
}

export type ConnectionStatus =
  | 'CONNECTED'
  | 'NOT_CONFIGURED'
  | 'CONNECTION_FAILED'
  | 'FIXTURE_MODE'
  | 'REQUIRES_VENDOR_ACCESS';

export interface ConnectionTestResult {
  success: boolean;
  status: ConnectionStatus;
  latencyMs: number;
  serverVersion?: string;
  databaseCollation?: string;
  isReadOnlyConfirmed: boolean;
  isFixture?: boolean;
  error?: string;
  details?: Record<string, unknown>;
}

export interface SchemaField {
  name: string;
  dataType: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  descriptionFa?: string;
}

export interface SchemaEntity {
  name: string;
  type: 'TABLE' | 'VIEW' | 'PROCEDURE' | 'ENDPOINT';
  descriptionFa?: string;
  fields: SchemaField[];
  rowCountEstimate?: number;
}

export interface SchemaDiscoveryResult {
  connectorId?: string;
  discoveredAt: string;
  entities: SchemaEntity[];
  error?: string;
}

export interface ExtractionOptions {
  entity: string;
  batchSize?: number;
  offset?: number;
  fields?: string[];
  filterCriteria?: Record<string, unknown>;
}

export interface IncrementalExtractionOptions extends ExtractionOptions {
  cursorField: string;
  cursorValue?: string | number;
}

export interface ExtractionBatchResult {
  entity: string;
  records: Record<string, unknown>[];
  recordsCount?: number;
  batchSize?: number;
  nextCursor?: string | number;
  nextCursorValue?: string | number;
  hasMore: boolean;
  extractedAt?: string;
  durationMs: number;
  isFixture?: boolean;
}

export interface HealthCheckResult {
  connectorId?: string;
  status?: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'NOT_CONFIGURED';
  isHealthy?: boolean;
  statusMessageFa?: string;
  lastSuccessfulSync?: string;
  pendingLagRecords?: number;
  checkedAt?: string;
  connection?: ConnectionTestResult;
  lastSyncTimestamp?: string;
  reconciliationStatus?: 'RECONCILED' | 'UNRECONCILED' | 'NOT_APPLICABLE';
  metrics?: Record<string, unknown>;
}
