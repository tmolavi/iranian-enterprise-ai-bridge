import { ConnectorManifest } from '@ieab/connector-sdk';

export const GENERIC_MSSQL_MANIFEST: ConnectorManifest = {
  connectorId: 'generic-mssql',
  vendor: 'Microsoft / Generic Iranian ERP Base',
  product: 'SQL Server Read-Only Connector',
  status: 'FIXTURE_TESTED',
  evidenceLevel: 'VF',
  versionsTested: ['SQL Server 2014', 'SQL Server 2016', 'SQL Server 2019', 'SQL Server 2022'],
  deploymentTypes: ['ON_PREMISE', 'HYBRID', 'CLOUD'],
  supportedEntities: [
    'Invoice',
    'Customer',
    'Supplier',
    'Product',
    'InventoryItem',
    'Receivable',
    'BankAccount',
    'JournalEntry',
    'ProductionOrder',
    'Downtime'
  ],
  supportedExtractionMethods: [
    'READ_REPLICA',
    'CDC_CHANGE_TRACKING',
    'VENDOR_VIEW',
    'READONLY_SQL'
  ],
  preferredExtractionMethod: 'READ_REPLICA',
  authenticationMethods: ['MSSQL_NATIVE'],
  incrementalSyncSupport: true,
  cdcSupport: true,
  requiredPermissions: [
    'CONNECT TO DATABASE',
    'SELECT ON SCHEMA::dbo (or specific vendor schema/view)'
  ],
  knownLimitations: [
    'Direct DB queries require establishing least-privilege SQL user with db_datareader or specific VIEW permissions only.',
    'Heavy aggregations must be run against a Read Replica (AlwaysOn) to prevent lock escalation in OLTP databases.',
    'Collation differences (Persian_100_CI_AI vs Arabic_CI_AS) require character normalization.'
  ],
  securityNotes: [
    'Enforces ApplicationIntent=ReadOnly in connection string.',
    'Blocks all DDL, DML, EXEC and stored procedure invocations through SQL Security Guard.',
    'Automatic masking of PII before persisting in cache.'
  ],
  evidenceReferences: [
    'Microsoft SQL Server Documentation - Read-Only Routing & Availability Groups',
    'Iranian ERP Market Research 2026 - Data Accessibility Matrix'
  ]
};
