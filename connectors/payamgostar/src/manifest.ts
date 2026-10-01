import { ConnectorManifest } from '@ieab/connector-sdk';

export const PAYAMGOSTAR_MANIFEST: ConnectorManifest = {
  connectorId: 'payamgostar-crm',
  vendor: 'PayamGostar (تجارت الکترونیک اول - پیام‌گستر)',
  product: 'PayamGostar CRM',
  status: 'SCAFFOLDED',
  evidenceLevel: 'TP',
  versionsTested: ['PayamGostar Web API v2', 'PayamGostar v4.x'],
  deploymentTypes: ['ON_PREMISE', 'CLOUD'],
  supportedEntities: ['Customer', 'Contact', 'SalesOrder', 'Contract'],
  supportedExtractionMethods: ['OFFICIAL_REST_API', 'WEBHOOK_EVENT', 'READ_REPLICA'],
  preferredExtractionMethod: 'OFFICIAL_REST_API',
  authenticationMethods: ['BASIC', 'BEARER_TOKEN'],
  incrementalSyncSupport: true,
  cdcSupport: false,
  requiredPermissions: ['PayamGostar API Key / Webhook Integration'],
  knownLimitations: ['API rate limits applied on high-frequency lead scraping.'],
  securityNotes: ['API keys must be securely stored in vault; customer PII masked.'],
  evidenceReferences: ['PayamGostar Public API Docs & Swagger (VF)']
};
