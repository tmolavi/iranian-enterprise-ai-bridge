/**
 * Connector Manifest Specification & Evidence Taxonomy.
 * Strict separation of Vendor Claim Evidence from Repository Implementation Maturity.
 */

export type EvidenceLevel =
  | 'VF'   // Verified Fact (Independently verified with working official docs/APIs)
  | 'VC'   // Vendor Claim (Stated by vendor marketing/sales, unverified)
  | 'TP'   // Third-Party Reported (Reported by enterprise clients/integrators)
  | 'AE'   // Anecdotal Evidence (Developer forum/community reports)
  | 'INF'  // Inference (Logical deduction from software architecture)
  | 'PNF'; // Public Evidence Not Found (No verifiable public docs/APIs)

export type ConnectorStatus =
  | 'LIVE_INTEGRATION_VERIFIED' // Verified against live production/staging ERP instance
  | 'FIXTURE_TESTED'           // Fully mapped and verified against synthetic enterprise fixtures
  | 'SCAFFOLDED'               // Schema contracts, interfaces, and extraction pipeline scaffolded
  | 'REQUIRES_VENDOR_ACCESS'   // Blocked waiting for proprietary vendor credentials/live DB access
  | 'DOCUMENTED_ONLY';         // Documented in architecture/research without code implementation

export type ExtractionMethod =
  | 'OFFICIAL_REST_API'
  | 'OFFICIAL_SOAP_WCF'
  | 'WEBHOOK_EVENT'
  | 'REPORTING_API'
  | 'READ_REPLICA'
  | 'CDC_CHANGE_TRACKING'
  | 'VENDOR_VIEW'
  | 'READONLY_SQL'
  | 'CONTROLLED_EXPORT'
  | 'FILE_DROP';

export interface ConnectorManifest {
  connectorId: string;
  vendor: string;
  product: string;
  status: ConnectorStatus;
  evidenceLevel: EvidenceLevel;
  versionsTested: string[];
  deploymentTypes: Array<'ON_PREMISE' | 'CLOUD' | 'HYBRID'>;
  supportedEntities: string[];
  supportedExtractionMethods: ExtractionMethod[];
  preferredExtractionMethod: ExtractionMethod;
  authenticationMethods: Array<'BASIC' | 'BEARER_TOKEN' | 'API_KEY' | 'MSSQL_NATIVE' | 'ORACLE_NATIVE' | 'POSTGRES_NATIVE'>;
  incrementalSyncSupport: boolean;
  cdcSupport: boolean;
  requiredPermissions: string[];
  knownLimitations: string[];
  securityNotes: string[];
  evidenceReferences: string[];
}
