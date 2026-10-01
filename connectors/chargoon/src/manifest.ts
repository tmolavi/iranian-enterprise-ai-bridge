import { ConnectorManifest } from '@ieab/connector-sdk';

export const CHARGOON_MANIFEST: ConnectorManifest = {
  connectorId: 'chargoon-didgah',
  vendor: 'Chargoon (چارگون)',
  product: 'Didgah Enterprise Suite (دیدگاه)',
  status: 'REQUIRES_VENDOR_ACCESS',
  evidenceLevel: 'TP',
  versionsTested: ['Didgah v4.x', 'Didgah v5.x'],
  deploymentTypes: ['ON_PREMISE', 'CLOUD'],
  supportedEntities: [
    'Document',
    'Meeting',
    'Decision',
    'ActionItem',
    'Employee',
    'Attendance',
    'Contract'
  ],
  supportedExtractionMethods: [
    'OFFICIAL_SOAP_WCF',
    'OFFICIAL_REST_API',
    'READ_REPLICA',
    'VENDOR_VIEW'
  ],
  preferredExtractionMethod: 'OFFICIAL_REST_API',
  authenticationMethods: ['BEARER_TOKEN', 'BASIC', 'MSSQL_NATIVE'],
  incrementalSyncSupport: true,
  cdcSupport: false,
  requiredPermissions: [
    'Didgah Open API / Web Service Gateway Token',
    'Read access to Didgah Process & Document archive'
  ],
  knownLimitations: [
    'BPMS process tables and workflow logs have proprietary XML/JSON internal payloads.',
    'Official SOAP services require WCF proxy configuration.'
  ],
  securityNotes: [
    'Strict access control on confidential board resolutions and employee personnel documents.'
  ],
  evidenceReferences: [
    'Chargoon Official Site & Developer Portal (VC)',
    'Iranian Enterprise AI Architecture Report 2026 (TP)'
  ]
};
