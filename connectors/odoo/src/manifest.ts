import { ConnectorManifest } from '@ieab/connector-sdk';

export const ODOO_MANIFEST: ConnectorManifest = {
  connectorId: 'odoo-iran-localized',
  vendor: 'Odoo Community / Iranian Localizers',
  product: 'Odoo Iranian Localized ERP',
  status: 'FIXTURE_TESTED',
  evidenceLevel: 'VF',
  versionsTested: ['Odoo 16.0 Community', 'Odoo 17.0 Community', 'Odoo 18.0'],
  deploymentTypes: ['ON_PREMISE', 'CLOUD', 'HYBRID'],
  supportedEntities: [
    'Invoice',
    'Customer',
    'Supplier',
    'Product',
    'InventoryItem',
    'PurchaseOrder',
    'BankAccount',
    'JournalEntry',
    'ProductionOrder'
  ],
  supportedExtractionMethods: [
    'OFFICIAL_REST_API',
    'READ_REPLICA',
    'CDC_CHANGE_TRACKING',
    'READONLY_SQL'
  ],
  preferredExtractionMethod: 'OFFICIAL_REST_API',
  authenticationMethods: ['API_KEY', 'BASIC', 'POSTGRES_NATIVE'],
  incrementalSyncSupport: true,
  cdcSupport: true,
  requiredPermissions: [
    'Odoo External API User (JSON-RPC / REST API Key)',
    'PostgreSQL Read-Only access (optional for high-throughput CDC)'
  ],
  knownLimitations: [
    'Shamsi date modules (l10n_ir_date) store dates in Gregorian internally in PostgreSQL and convert in UI layer.'
  ],
  securityNotes: [
    'Enforces dedicated Odoo system user with restricted read-only model permissions.'
  ],
  evidenceReferences: [
    'Odoo External API Official Developer Documentation (VF)',
    'Iranian Odoo Community Repositories (VF)'
  ]
};
