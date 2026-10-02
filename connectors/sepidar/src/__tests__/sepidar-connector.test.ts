import test from 'node:test';
import assert from 'node:assert/strict';
import { SepidarConnector } from '../sepidar-connector.js';
import { ConnectorTestHarness } from '@ieab/connector-sdk';

test('SepidarConnector: passes test harness in fixture mode', async () => {
  const connector = new SepidarConnector();
  const report = await ConnectorTestHarness.runSuite(connector, 'SLS_Invoice', 'org-kaveh-01');

  assert.equal(report.passed, true, 'Sepidar harness suite must pass in fixture mode');
  assert.equal(report.connectorId, 'sepidar-systemgroup');
});

test('SepidarConnector: returns NOT_VERIFIED for unverified live connection and health check', async () => {
  const connector = new SepidarConnector({
    host: '192.168.1.50',
    database: 'Sepidar_DB',
    username: 'sa'
  });

  const connRes = await connector.testConnection();
  assert.equal(connRes.success, false);
  assert.equal(connRes.status, 'NOT_VERIFIED');

  const healthRes = await connector.healthCheck();
  assert.equal(healthRes.isHealthy, false);
  assert.equal(healthRes.status, 'NOT_VERIFIED');
});

test('SepidarConnector: normalizes records with NOT_VERIFIED reconciliationStatus', async () => {
  const connector = new SepidarConnector();
  const rawRecords = [
    {
      InvoiceID: 101,
      InvoiceNumber: 'INV-1403-101',
      InvoiceDate: '1403/07/01',
      CustomerID: 55,
      CustomerTitle: 'شرکت صنایع سپیدار',
      Price: 5000000000,
      TotalAmount: 5500000000
    }
  ];

  const canonical: any[] = await connector.normalizeToCanonical('SLS_Invoice', rawRecords, 'org-kaveh-01');
  assert.equal(canonical.length, 1);
  assert.equal(canonical[0].metadata.sourceSystem, 'SEPIDAR');
  assert.equal(canonical[0].metadata.reconciliationStatus, 'NOT_VERIFIED');
});
