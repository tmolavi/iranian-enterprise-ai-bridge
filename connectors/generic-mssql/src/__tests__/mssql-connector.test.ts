import test from 'node:test';
import assert from 'node:assert/strict';
import { GenericMSSQLConnector } from '../mssql-connector.js';
import { ConnectorTestHarness } from '@ieab/connector-sdk';

test('GenericMSSQLConnector: passes full test harness suite', async () => {
  const connector = new GenericMSSQLConnector({
    host: 'localhost',
    database: 'KavehSteel_ERP',
    readOnlyIntent: true
  });

  const report = await ConnectorTestHarness.runSuite(connector, 'vw_IEAB_SalesInvoices', 'org-kaveh-01');

  assert.equal(report.passed, true, 'Harness suite must pass');
  assert.equal(report.connectorId, 'generic-mssql');
  assert.equal(report.checks.length, 5);
  for (const check of report.checks) {
    assert.equal(check.passed, true, `Check "${check.name}" failed: ${check.error}`);
  }
});

test('GenericMSSQLConnector: normalizes Persian/Arabic text and parses Shamsi dates during canonical mapping', async () => {
  const connector = new GenericMSSQLConnector();
  const rawInvoices = [
    {
      InvoiceID: 999,
      InvoiceNumber: 'INV-1403-999',
      InvoiceDateShamsi: '1403/07/15',
      CustomerID: 88,
      CustomerName: 'شركت كاوه‌فولاد',
      GrossAmountRial: 10000000000,
      NetAmountRial: 10000000000
    }
  ];

  const canonical: any[] = await connector.normalizeToCanonical('vw_IEAB_SalesInvoices', rawInvoices, 'org-01');
  assert.equal(canonical.length, 1);
  assert.equal(canonical[0].invoiceDateJalali, '1403/07/15');
  assert.equal(canonical[0].invoiceDateGregorian, '2024-10-06');
  assert.equal(canonical[0].metadata.sourceSystem, 'GENERIC_MSSQL');
  assert.ok(canonical[0].metadata.checksum.length > 10);
});

test('GenericMSSQLConnector: returns honest status for unverified live connection', async () => {
  const unconfigured = new GenericMSSQLConnector();
  const unconfiguredRes = await unconfigured.testConnection();
  assert.equal(unconfiguredRes.success, false);
  assert.equal(unconfiguredRes.status, 'NOT_CONFIGURED');

  const configured = new GenericMSSQLConnector({
    host: '192.168.1.100',
    database: 'SampleDB',
    username: 'sa'
  });
  const configuredRes = await configured.testConnection();
  assert.equal(configuredRes.success, false);
  assert.equal(configuredRes.status, 'NOT_VERIFIED');
});
