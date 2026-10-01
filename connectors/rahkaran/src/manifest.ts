import { ConnectorManifest } from '@ieab/connector-sdk';

export const RAHKARAN_MANIFEST: ConnectorManifest = {
  connectorId: 'rahkaran-systemgroup',
  vendor: 'System Group (همکاران سیستم)',
  product: 'Rahkaran ERP (راهکاران)',
  status: 'REQUIRES_VENDOR_ACCESS',
  evidenceLevel: 'TP',
  versionsTested: ['Rahkaran v3.x', 'Rahkaran v4.x', 'Rahkaran Cloud'],
  deploymentTypes: ['ON_PREMISE', 'CLOUD', 'HYBRID'],
  supportedEntities: [
    'SlmInvoice',
    'SlmInvoiceItem',
    'GnrParty',
    'GnrItem',
    'InvCardex',
    'TrsPayment',
    'TrsReceive',
    'TrsBankAccount',
    'FinVoucher',
    'FinAccount'
  ],
  supportedExtractionMethods: [
    'READ_REPLICA',
    'CDC_CHANGE_TRACKING',
    'VENDOR_VIEW',
    'OFFICIAL_REST_API'
  ],
  preferredExtractionMethod: 'READ_REPLICA',
  authenticationMethods: ['MSSQL_NATIVE', 'BEARER_TOKEN'],
  incrementalSyncSupport: true,
  cdcSupport: true,
  requiredPermissions: [
    'SELECT on Rahkaran reporting views / read replica',
    'Rahkaran Web API integration token (where available)'
  ],
  knownLimitations: [
    'Direct schema queries without vendor views risk query timeout during active accounting closing periods.',
    'Floating detail accounts (تفصیلی شناور سطوح ۴ تا ۶) require multi-table join resolution.',
    'Character collation commonly uses Arabic_CI_AS in legacy instances and Persian_100_CI_AI in newer setups.'
  ],
  securityNotes: [
    'Always deploy with Read-Only connection string.',
    'Never query live production database during peak hours without AlwaysOn Read Replica routing.'
  ],
  evidenceReferences: [
    'System Group Official Product Documentation (VC)',
    'Iranian Enterprise Data Architecture Deep Research 2026 (TP)'
  ]
};
