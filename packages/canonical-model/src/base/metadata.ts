/**
 * Immutable Lineage & Metadata Envelope for Canonical Enterprise Entities.
 * Guarantees zero loss of traceability back to source ERP tables/rows.
 */

export type ReconciliationStatus = 'RECONCILED' | 'UNRECONCILED' | 'PENDING' | 'NOT_APPLICABLE';

export interface CanonicalMetadata {
  /** Source ERP/CRM/BPMS system ID (e.g., 'RAHKARAN', 'CHARGOON', 'SHAUTO', 'SEPIDAR', 'GENERIC_MSSQL') */
  sourceSystem: string;
  /** Original entity or table name in source system (e.g., 'SlmInvoice', 'GnrParty', 'InvCardex') */
  sourceEntity: string;
  /** Primary key or composite key in source system */
  sourcePk: string;
  /** Organization / Tenant ID */
  orgId: string;
  /** Creation timestamp in source system (ISO string) */
  sourceCreatedAt?: string;
  /** Last update timestamp in source system (ISO string) */
  sourceUpdatedAt?: string;
  /** Ingestion/sync timestamp in IEAB (ISO string) */
  syncedAt: string;
  /** Version of connector used during extraction */
  connectorVersion: string;
  /** SHA-256 payload checksum for change detection and idempotency */
  checksum: string;
  /** Soft delete flag */
  isDeleted: boolean;
  /** Financial and ledger reconciliation status */
  reconciliationStatus: ReconciliationStatus;
  /** Optional freeform raw attributes preserved during transformation */
  rawAttributes?: Record<string, unknown>;
}

export interface BaseCanonicalEntity {
  id: string; // Unique global canonical ID (UUID or urn:ieab:org:entity:pk)
  orgId: string;
  metadata: CanonicalMetadata;
}
