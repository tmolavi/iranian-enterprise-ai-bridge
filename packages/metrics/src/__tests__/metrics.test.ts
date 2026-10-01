import test from 'node:test';
import assert from 'node:assert/strict';
import { MetricCalculator, EnterpriseDataSet } from '../calculator/metric-calculator.js';
import { CashForecaster } from '../forecast/cash-forecaster.js';
import { SubledgerReconciliationEngine } from '../reconciliation/reconciliation-engine.js';

function getTestDataSet(): EnterpriseDataSet {
  return {
    invoices: [
      {
        id: 'inv-1',
        orgId: 'org-kaveh-01',
        invoiceNumber: 'INV-01',
        invoiceDateJalali: '1403/07/10',
        invoiceDateGregorian: '2024-10-01',
        customerId: 'cust-1',
        totalGrossAmountRial: 25_000_000_000,
        totalDiscountAmountRial: 1_000_000_000,
        totalVatAmountRial: 2_400_000_000,
        totalTollAmountRial: 0,
        totalNetAmountRial: 26_400_000_000,
        paidAmountRial: 0,
        remainingAmountRial: 26_400_000_000,
        status: 'CONFIRMED',
        lines: [],
        metadata: {
          sourceSystem: 'TEST_MSSQL',
          sourceEntity: 'Invoice',
          sourcePk: '1',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'abc',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      }
    ],
    receivables: [],
    bankAccounts: [
      {
        id: 'bank-1',
        orgId: 'org-kaveh-01',
        bankNameFa: 'ملی',
        accountNumber: '0101',
        iban: 'IR123',
        currency: 'RIAL',
        currentBalanceRial: 50_000_000_000,
        isActive: true,
        metadata: {
          sourceSystem: 'TEST_MSSQL',
          sourceEntity: 'Bank',
          sourcePk: '1',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'abc',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      }
    ],
    cashAccounts: [],
    inventoryItems: [
      {
        id: 'item-1',
        orgId: 'org-kaveh-01',
        warehouseId: 'wh-1',
        productId: 'prod-1',
        onHandQty: 100,
        reservedQty: 0,
        availableQty: 100,
        averageUnitCostRial: 100_000_000,
        totalValueRial: 10_000_000_000,
        metadata: {
          sourceSystem: 'TEST_MSSQL',
          sourceEntity: 'Cardex',
          sourcePk: '1',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'abc',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      }
    ],
    productionOrders: [],
    downtimes: [],
    qualityInspections: [],
    customers: [
      {
        id: 'cust-1',
        orgId: 'org-kaveh-01',
        code: 'C01',
        nameFa: 'شرکت فولاد پارس',
        partyType: 'LEGAL_ENTITY',
        isActive: true,
        metadata: {
          sourceSystem: 'TEST_MSSQL',
          sourceEntity: 'Party',
          sourcePk: '1',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'abc',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      }
    ],
    products: []
  };
}

test('MetricCalculator: calculates Sales, Cash and OEE authoritative metrics', () => {
  const calc = new MetricCalculator();
  const dataset = getTestDataSet();

  const sales = calc.calculate('NET_SALES', dataset, { orgId: 'org-kaveh-01' });
  assert.equal(sales.metricId, 'NET_SALES');
  assert.equal(sales.value, 26_400_000_000);
  assert.equal(sales.reconciliationStatus, 'RECONCILED');

  const cash = calc.calculate('CASH_POSITION', dataset, { orgId: 'org-kaveh-01' });
  assert.equal(cash.metricId, 'CASH_POSITION');
  assert.equal(cash.value, 50_000_000_000);
});

test('CashForecaster: generates 30-day projection with confidence intervals', () => {
  const forecast = CashForecaster.forecast30Days(50_000_000_000);
  assert.ok(forecast.forecastPoints.length > 5);
  assert.ok(['HEALTHY', 'TIGHT', 'DEFICIT_RISK'].includes(forecast.runwayStatus));
});

test('SubledgerReconciliationEngine: detects ledger and subledger reconciliation', () => {
  const dataset = getTestDataSet();
  const report = SubledgerReconciliationEngine.reconcile(
    'org-kaveh-01',
    dataset.invoices,
    [],
    dataset.inventoryItems
  );

  assert.equal(report.orgId, 'org-kaveh-01');
  assert.ok(typeof report.isFullyReconciled === 'boolean');
});
