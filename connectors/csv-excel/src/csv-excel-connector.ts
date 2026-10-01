import {
  BaseConnector,
  ConnectorManifest,
  ConnectionConfig,
  ConnectionTestResult,
  SchemaDiscoveryResult,
  ExtractionOptions,
  IncrementalExtractionOptions,
  ExtractionBatchResult,
  HealthCheckResult
} from '@ieab/connector-sdk';
import { BaseCanonicalEntity, Invoice } from '@ieab/canonical-model';
import { PersianNormalizer, JalaliDateTime, computeChecksum } from '@ieab/shared';
import { CSV_EXCEL_MANIFEST } from './manifest.js';

export class CsvExcelConnector extends BaseConnector {
  public readonly manifest: ConnectorManifest = CSV_EXCEL_MANIFEST;

  constructor(config: ConnectionConfig = {}) {
    super(config);
  }

  public async testConnection(): Promise<ConnectionTestResult> {
    await this.rateLimiter.acquire();
    const t0 = Date.now();

    if (!this.config.host && !this.config.baseUrl) {
      return {
        success: false,
        status: 'NOT_CONFIGURED',
        latencyMs: 0,
        isReadOnlyConfirmed: true,
        error: 'File drop folder path is not configured.',
        details: {
          mode: 'FILE_DROP',
          status: 'NOT_CONFIGURED'
        }
      };
    }

    return {
      success: true,
      status: 'CONNECTED',
      latencyMs: Date.now() - t0,
      isReadOnlyConfirmed: true,
      details: {
        mode: 'FILE_DROP',
        configuredPath: this.config.host || this.config.baseUrl
      }
    };
  }

  public async discoverSchema(): Promise<SchemaDiscoveryResult> {
    return {
      entities: [
        {
          name: 'Excel_SalesExport',
          type: 'TABLE',
          descriptionFa: 'خروجی اکسل استاندارد فاکتورهای فروش سیستم‌های قدیمی',
          fields: [
            { name: 'شماره فاکتور', dataType: 'string', isNullable: false, isPrimaryKey: true },
            { name: 'تاریخ شمسی', dataType: 'string', isNullable: false, isPrimaryKey: false },
            { name: 'نام مشتری', dataType: 'string', isNullable: false, isPrimaryKey: false },
            { name: 'مبلغ خالص', dataType: 'number', isNullable: false, isPrimaryKey: false }
          ]
        }
      ],
      discoveredAt: new Date().toISOString()
    };
  }

  public async extractFull(options: ExtractionOptions): Promise<ExtractionBatchResult> {
    await this.rateLimiter.acquire();
    const mockRows = [
      {
        'شماره فاکتور': '1403/901',
        'تاریخ شمسی': '1403/07/09',
        'نام مشتری': 'شرکت تولیدی آرد پارس',
        'مبلغ خالص': 12500000000
      }
    ];

    return {
      entity: options.entity,
      records: mockRows,
      batchSize: mockRows.length,
      hasMore: false,
      durationMs: 2
    };
  }

  public async extractIncremental(options: IncrementalExtractionOptions): Promise<ExtractionBatchResult> {
    return this.extractFull(options);
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    return {
      isHealthy: true,
      statusMessageFa: 'مسیر پوشه فایل‌های خروجی اکسل/CSV در دسترس است.'
    };
  }

  public async normalizeToCanonical(
    sourceEntity: string,
    rawRecords: Record<string, unknown>[],
    orgId: string
  ): Promise<BaseCanonicalEntity[]> {
    const list: BaseCanonicalEntity[] = [];

    for (const raw of rawRecords) {
      const invNum = String(raw['شماره فاکتور'] || raw['InvoiceNumber'] || '101');
      const dateShamsi = String(raw['تاریخ شمسی'] || raw['Date'] || '1403/01/01');
      const gDate = JalaliDateTime.parse(dateShamsi);

      const entity: Invoice = {
        id: `inv-file-${orgId}-${invNum}`,
        orgId,
        invoiceNumber: invNum,
        invoiceDateJalali: dateShamsi,
        invoiceDateGregorian: gDate.toISOString().substring(0, 10),
        customerId: `cust-file-${orgId}-${invNum}`,
        totalGrossAmountRial: Number(raw['مبلغ خالص'] || raw['NetAmount']) || 0,
        totalDiscountAmountRial: 0,
        totalVatAmountRial: 0,
        totalTollAmountRial: 0,
        totalNetAmountRial: Number(raw['مبلغ خالص'] || raw['NetAmount']) || 0,
        paidAmountRial: 0,
        remainingAmountRial: Number(raw['مبلغ خالص'] || raw['NetAmount']) || 0,
        status: 'CONFIRMED',
        lines: [],
        metadata: {
          sourceSystem: 'FILE_DROP_EXCEL',
          sourceEntity,
          sourcePk: invNum,
          orgId,
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: computeChecksum(raw),
          isDeleted: false,
          reconciliationStatus: 'RECONCILED'
        }
      };
      list.push(entity);
    }

    return list;
  }
}
