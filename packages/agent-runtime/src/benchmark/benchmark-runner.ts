import { ExecutiveCopilot } from '../runtime/executive-copilot.js';
import { CEO_BENCHMARK_100 } from './benchmark-dataset.js';
import { EnterpriseDataSet } from '@ieab/metrics';
import { PersianNormalizer } from '@ieab/shared';

export function createMockEnterpriseDataSet(): EnterpriseDataSet {
  return {
    invoices: [
      {
        id: 'inv-101',
        orgId: 'org-kaveh-01',
        invoiceNumber: 'INV-1403-1001',
        invoiceDateJalali: '1403/07/10',
        invoiceDateGregorian: '2024-10-01',
        customerId: 'cust-pars-01',
        totalGrossAmountRial: 25_000_000_000,
        totalDiscountAmountRial: 1_000_000_000,
        totalVatAmountRial: 2_400_000_000,
        totalTollAmountRial: 0,
        totalNetAmountRial: 26_400_000_000,
        paidAmountRial: 10_000_000_000,
        remainingAmountRial: 16_400_000_000,
        status: 'CONFIRMED',
        lines: [
          {
            lineNumber: 1,
            productId: 'prod-steel-01',
            quantity: 100,
            unitPriceRial: 250_000_000,
            grossAmountRial: 25_000_000_000,
            discountAmountRial: 1_000_000_000,
            vatRate: 0.10,
            vatAmountRial: 2_400_000_000,
            netAmountRial: 26_400_000_000,
            cogsAmountRial: 18_000_000_000
          }
        ],
        metadata: {
          sourceSystem: 'RAHKARAN_MSSQL',
          sourceEntity: 'SlmInvoice',
          sourcePk: '1001',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'sha256_mock_001',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      },
      {
        id: 'inv-102',
        orgId: 'org-kaveh-01',
        invoiceNumber: 'INV-1403-1002',
        invoiceDateJalali: '1403/07/12',
        invoiceDateGregorian: '2024-10-03',
        customerId: 'cust-zagros-02',
        totalGrossAmountRial: 15_000_000_000,
        totalDiscountAmountRial: 500_000_000,
        totalVatAmountRial: 1_450_000_000,
        totalTollAmountRial: 0,
        totalNetAmountRial: 15_950_000_000,
        paidAmountRial: 15_950_000_000,
        remainingAmountRial: 0,
        status: 'CONFIRMED',
        lines: [
          {
            lineNumber: 1,
            productId: 'prod-sheet-02',
            quantity: 50,
            unitPriceRial: 300_000_000,
            grossAmountRial: 15_000_000_000,
            discountAmountRial: 500_000_000,
            vatRate: 0.10,
            vatAmountRial: 1_450_000_000,
            netAmountRial: 15_950_000_000,
            cogsAmountRial: 11_000_000_000
          }
        ],
        metadata: {
          sourceSystem: 'RAHKARAN_MSSQL',
          sourceEntity: 'SlmInvoice',
          sourcePk: '1002',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'sha256_mock_002',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      }
    ],
    receivables: [
      {
        id: 'rec-201',
        orgId: 'org-kaveh-01',
        customerId: 'cust-pars-01',
        customerNameFa: 'شرکت بازرگانی پارس',
        invoiceId: 'inv-101',
        invoiceNumber: 'INV-1403-1001',
        invoiceDateJalali: '1403/05/10',
        dueDateJalali: '1403/06/10',
        dueDateGregorian: '2024-08-31',
        originalAmountRial: 26_400_000_000,
        remainingAmountRial: 16_400_000_000,
        overdueDays: 35,
        agingBucket: '31_TO_60',
        disputed: false,
        metadata: {
          sourceSystem: 'RAHKARAN_MSSQL',
          sourceEntity: 'SlmReceivable',
          sourcePk: '201',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'sha256_rec_001',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      }
    ],
    bankAccounts: [
      {
        id: 'bank-melli-01',
        orgId: 'org-kaveh-01',
        bankNameFa: 'ملی',
        accountNumber: '0105432100001',
        iban: 'IR120170000000105432100001',
        currency: 'RIAL',
        currentBalanceRial: 32_000_000_000,
        isActive: true,
        metadata: {
          sourceSystem: 'RAHKARAN_MSSQL',
          sourceEntity: 'TrsBankAccount',
          sourcePk: 'b1',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'sha_b1',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      },
      {
        id: 'bank-mellat-02',
        orgId: 'org-kaveh-01',
        bankNameFa: 'ملت',
        accountNumber: '587643210098',
        iban: 'IR980120000000587643210098',
        currency: 'RIAL',
        currentBalanceRial: 18_500_000_000,
        isActive: true,
        metadata: {
          sourceSystem: 'RAHKARAN_MSSQL',
          sourceEntity: 'TrsBankAccount',
          sourcePk: 'b2',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'sha_b2',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      }
    ],
    cashAccounts: [
      {
        id: 'cash-factory-01',
        orgId: 'org-kaveh-01',
        titleFa: 'صندوق تنخواه کارخانه کاوه',
        custodianEmployeeId: 'emp-501',
        currentBalanceRial: 500_000_000,
        isActive: true,
        metadata: {
          sourceSystem: 'RAHKARAN_MSSQL',
          sourceEntity: 'TrsCash',
          sourcePk: 'c1',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'sha_c1',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      }
    ],
    inventoryItems: [
      {
        id: 'inv-item-01',
        orgId: 'org-kaveh-01',
        warehouseId: 'wh-main-01',
        productId: 'prod-steel-01',
        onHandQty: 450,
        reservedQty: 50,
        availableQty: 400,
        averageUnitCostRial: 180_000_000,
        totalValueRial: 81_000_000_000,
        metadata: {
          sourceSystem: 'RAHKARAN_MSSQL',
          sourceEntity: 'InvCardex',
          sourcePk: 'card-01',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'sha_inv_1',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      }
    ],
    productionOrders: [
      {
        id: 'po-1403-501',
        orgId: 'org-kaveh-01',
        orderNumber: 'PRD-1403-501',
        productId: 'prod-steel-01',
        plannedQuantity: 1000,
        producedQuantity: 960,
        rejectedQuantity: 24,
        startDateJalali: '1403/07/01',
        status: 'COMPLETED',
        metadata: {
          sourceSystem: 'SHAUTO_MSSQL',
          sourceEntity: 'PrdOrder',
          sourcePk: 'po-501',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'sha_po_1',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      }
    ],
    downtimes: [
      {
        id: 'dt-301',
        orgId: 'org-kaveh-01',
        machineId: 'mach-furnace-01',
        downtimeCategory: 'SETUP',
        startTime: '2024-10-01T08:00:00Z',
        endTime: '2024-10-01T11:30:00Z',
        durationMinutes: 210,
        reasonFa: 'تعویض قالب و کالیبراسیون سنسور حرارتی',
        isPlanned: true,
        metadata: {
          sourceSystem: 'SHAUTO_MSSQL',
          sourceEntity: 'CmmsDowntime',
          sourcePk: 'dt-301',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'sha_dt_1',
          isDeleted: false,
          reconciliationStatus: 'NOT_APPLICABLE'
        }
      }
    ],
    qualityInspections: [
      {
        id: 'qc-401',
        orgId: 'org-kaveh-01',
        inspectionNumber: 'QC-1403-401',
        inspectionType: 'FINAL',
        productId: 'prod-steel-01',
        inspectedQty: 960,
        acceptedQty: 936,
        rejectedQty: 24,
        reworkQty: 0,
        defectReasonFa: 'عدم انطباق تلرانس ضخامت در کناره ورق',
        metadata: {
          sourceSystem: 'SHAUTO_MSSQL',
          sourceEntity: 'QcInspection',
          sourcePk: 'qc-401',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'sha_qc_1',
          isDeleted: false,
          reconciliationStatus: 'NOT_APPLICABLE'
        }
      }
    ],
    customers: [
      {
        id: 'cust-pars-01',
        orgId: 'org-kaveh-01',
        code: 'CUST-101',
        nameFa: 'شرکت بازرگانی پارس',
        partyType: 'LEGAL_ENTITY',
        nationalId: '10103456789',
        isActive: true,
        metadata: {
          sourceSystem: 'RAHKARAN_MSSQL',
          sourceEntity: 'GnrParty',
          sourcePk: 'p1',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'sha_p1',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      },
      {
        id: 'cust-zagros-02',
        orgId: 'org-kaveh-01',
        code: 'CUST-102',
        nameFa: 'صنایع فلزی زاگرس',
        partyType: 'LEGAL_ENTITY',
        nationalId: '10109876543',
        isActive: true,
        metadata: {
          sourceSystem: 'RAHKARAN_MSSQL',
          sourceEntity: 'GnrParty',
          sourcePk: 'p2',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'sha_p2',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      }
    ],
    products: [
      {
        id: 'prod-steel-01',
        orgId: 'org-kaveh-01',
        code: 'PRD-ST-01',
        nameFa: 'ورق فولادی گالوانیزه ۲ میلی‌متر',
        productType: 'FINISHED_GOODS',
        primaryUom: 'تن',
        isActive: true,
        metadata: {
          sourceSystem: 'RAHKARAN_MSSQL',
          sourceEntity: 'GnrItem',
          sourcePk: 'it1',
          orgId: 'org-kaveh-01',
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: 'sha_it1',
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      }
    ]
  };
}

export async function runCEOBenchmark(): Promise<void> {
  const copilot = new ExecutiveCopilot();
  const dataset = createMockEnterpriseDataSet();
  const userCtx = {
    userId: 'usr-ceo-01',
    fullNameFa: 'دکتر محمدی (مدیرعامل)',
    role: 'CEO' as const,
    orgId: 'org-kaveh-01'
  };

  console.log('======================================================================');
  console.log('🏛️ IRANIAN ENTERPRISE AI BRIDGE — STRATEGIC CEO BENCHMARK SUITE');
  console.log('======================================================================\n');

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < CEO_BENCHMARK_100.length; i++) {
    const q = CEO_BENCHMARK_100[i];
    const t0 = Date.now();
    try {
      const answer = await copilot.ask(userCtx, q.questionFa, dataset, `bench-${q.id}`);
      const durationMs = Date.now() - t0;

      // Verification checks
      const hasSummary = Boolean(answer.executiveSummaryFa && answer.executiveSummaryFa.length > 5);
      const hasEvidence = Boolean(answer.evidence && answer.evidence.sourceSystem);
      const isReconciled = answer.reconciled || answer.evidence.reconciliationStatus === 'NOT_APPLICABLE';

      if (hasSummary && hasEvidence && isReconciled) {
        passed++;
        console.log(`✅ [PASS] [${q.category}] [${q.id}] ${q.questionFa}`);
        console.log(`   ↳ پاسخ اجرایی: ${answer.executiveSummaryFa}`);
        console.log(`   ↳ منبع داده: ${answer.evidence.sourceSystem} | وضعیت تطبیق مالی: ${answer.evidence.reconciliationStatus} | زمان: ${durationMs}ms\n`);
      } else {
        failed++;
        console.log(`❌ [FAIL] [${q.category}] [${q.id}] ${q.questionFa}`);
        console.log(`   ↳ علت شکست: عدم ارائه شواهد کافی یا عدم تطبیق مالی\n`);
      }
    } catch (err: any) {
      failed++;
      console.log(`❌ [ERROR] [${q.category}] [${q.id}] ${q.questionFa} -> ${err.message}\n`);
    }
  }

  console.log('======================================================================');
  console.log(`📊 EXECUTABLE BENCHMARK RESULTS: Passed: ${passed} | Failed: ${failed} | Executable Cases: ${CEO_BENCHMARK_100.length}`);
  console.log(`📑 Total Documented Catalog: 100 Strategic Questions (docs/fa/CEO-QUESTIONS.md)`);
  console.log(`🎯 Deterministic Evidence Validation Rate: ${((passed / CEO_BENCHMARK_100.length) * 100).toFixed(1)}%`);
  console.log(`⚡ Execution Mode: In-Memory Deterministic Rule-Based Tool Planner (Offline Fixture)`);
  console.log('======================================================================\n');
}

if (process.argv[1]?.endsWith('benchmark-runner.js')) {
  runCEOBenchmark().catch(console.error);
}
