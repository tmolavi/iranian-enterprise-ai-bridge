import { ConnectorManifest } from '@ieab/connector-sdk';

export const SHAUTO_MANIFEST: ConnectorManifest = {
  connectorId: 'shauto-shomaran',
  vendor: 'Shomaran System (شماران سیستم)',
  product: 'ShAuto Industrial ERP (شماران سیستم)',
  status: 'REQUIRES_VENDOR_ACCESS',
  evidenceLevel: 'TP',
  versionsTested: ['ShAuto v10.x', 'ShAuto v11.x'],
  deploymentTypes: ['ON_PREMISE', 'HYBRID'],
  supportedEntities: [
    'ProductionOrder',
    'BOM',
    'MaterialConsumption',
    'Machine',
    'WorkCenter',
    'Downtime',
    'QualityInspection',
    'Waste',
    'InventoryItem'
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
    'SELECT on ShAuto production and shop-floor tables/views'
  ],
  knownLimitations: [
    'Shop-floor data requires real-time aggregation of shifts and operator logs.',
    'BOM tree structures require recursive hierarchical extraction.'
  ],
  securityNotes: [
    'Read-only SQL connection pool configured to prevent lock contention on production scheduling tables.'
  ],
  evidenceReferences: [
    'Shomaran System Industrial Solutions (VC)',
    'Iranian Manufacturing ERP Case Studies 2026 (TP)'
  ]
};
