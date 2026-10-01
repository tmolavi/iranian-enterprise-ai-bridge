import { ConnectorManifest } from '@ieab/connector-sdk';

export const SEPIDAR_MANIFEST: ConnectorManifest = {
  connectorId: 'sepidar-systemgroup',
  vendor: 'System Group (سپیدار سیستم)',
  product: 'Sepidar ERP & Accounting (سپیدار)',
  status: 'SCAFFOLDED',
  evidenceLevel: 'TP',
  versionsTested: ['Sepidar v5.x', 'Sepidar v6.x'],
  deploymentTypes: ['ON_PREMISE'],
  supportedEntities: [
    'Invoice',
    'Customer',
    'Supplier',
    'Product',
    'InventoryItem',
    'BankAccount',
    'Receivable',
    'JournalEntry'
  ],
  supportedExtractionMethods: [
    'READ_REPLICA',
    'VENDOR_VIEW',
    'READONLY_SQL'
  ],
  preferredExtractionMethod: 'READONLY_SQL',
  authenticationMethods: ['MSSQL_NATIVE'],
  incrementalSyncSupport: true,
  cdcSupport: false,
  requiredPermissions: [
    'SELECT on Sepidar SQL Server database (e.g., db_datareader role)'
  ],
  knownLimitations: [
    'Standard Sepidar does not expose an official public REST API; direct read-only SQL connection is standard.',
    'Inventory calculation uses standard average cost stored in Cardex tables.'
  ],
  securityNotes: [
    'Create a dedicated SQL user with db_datareader permissions on Sepidar database.',
    'Always query with (NOLOCK) or read committed snapshot.'
  ],
  evidenceReferences: [
    'Sepidar SQL Database Schema Community Reverse Engineering (VF)',
    'Iranian ERP Market Research 2026'
  ]
};
