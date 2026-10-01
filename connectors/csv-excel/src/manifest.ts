import { ConnectorManifest } from '@ieab/connector-sdk';

export const CSV_EXCEL_MANIFEST: ConnectorManifest = {
  connectorId: 'csv-excel-drop',
  vendor: 'Universal File Drop',
  product: 'CSV & Excel Governed Importer',
  status: 'FIXTURE_TESTED',
  evidenceLevel: 'VF',
  versionsTested: ['CSV UTF-8', 'Excel .xlsx 2016+'],
  deploymentTypes: ['ON_PREMISE', 'CLOUD', 'HYBRID'],
  supportedEntities: ['Invoice', 'Customer', 'InventoryItem', 'Receivable', 'JournalEntry'],
  supportedExtractionMethods: ['CONTROLLED_EXPORT', 'FILE_DROP'],
  preferredExtractionMethod: 'FILE_DROP',
  authenticationMethods: ['BASIC'],
  incrementalSyncSupport: false,
  cdcSupport: false,
  requiredPermissions: ['Read permission on secure input drop folder'],
  knownLimitations: ['Requires batch ingestion upon new file placement; no real-time push.'],
  securityNotes: ['Files must be scanned and checksum verified before parsing.'],
  evidenceReferences: ['Standard RFC 4180 CSV & OpenXML Excel format (VF)']
};
