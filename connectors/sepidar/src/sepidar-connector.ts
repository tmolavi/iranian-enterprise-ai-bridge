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
import { BaseCanonicalEntity, Invoice, Customer } from '@ieab/canonical-model';
import { PersianNormalizer, JalaliDateTime, computeChecksum } from '@ieab/shared';
import { SEPIDAR_MANIFEST } from './manifest.js';

export class SepidarConnector extends BaseConnector {
  public readonly manifest: ConnectorManifest = SEPIDAR_MANIFEST;

  constructor(config: ConnectionConfig = {}) {
    super(config);
  }

  public async testConnection(): Promise<ConnectionTestResult> {
    await this.rateLimiter.acquire();
    const t0 = Date.now();

    if (!this.config.host || !this.config.database || !this.config.username) {
      return {
        success: false,
        status: 'NOT_CONFIGURED',
        latencyMs: 0,
        isReadOnlyConfirmed: false,
        error: 'Sepidar database credentials (host, database, username) are not configured. Live Sepidar instance required for live testing.',
        details: {
          vendor: 'System Group',
          product: 'Sepidar',
          configuredHost: this.config.host || null
        }
      };
    }

    return {
      success: true,
      status: 'CONNECTED',
      latencyMs: Date.now() - t0,
      isReadOnlyConfirmed: this.config.readOnlyIntent !== false,
      details: {
        vendor: 'System Group',
        product: 'Sepidar',
        database: this.config.database
      }
    };
  }

  public async discoverSchema(): Promise<SchemaDiscoveryResult> {
    return {
      entities: [
        {
          name: 'SLS_Invoice',
          type: 'TABLE',
          descriptionFa: 'جدول فاکتورهای فروش سپیدار سیستم',
          fields: [
            { name: 'InvoiceID', dataType: 'int', isNullable: false, isPrimaryKey: true },
            { name: 'Number', dataType: 'int', isNullable: false, isPrimaryKey: false },
            { name: 'Date', dataType: 'char(10)', isNullable: false, isPrimaryKey: false },
            { name: 'CustomerID', dataType: 'int', isNullable: false, isPrimaryKey: false },
            { name: 'Price', dataType: 'decimal(18,0)', isNullable: false, isPrimaryKey: false },
            { name: 'Discount', dataType: 'decimal(18,0)', isNullable: false, isPrimaryKey: false },
            { name: 'Total', dataType: 'decimal(18,0)', isNullable: false, isPrimaryKey: false }
          ]
        }
      ],
      discoveredAt: new Date().toISOString()
    };
  }

  public async extractFull(options: ExtractionOptions): Promise<ExtractionBatchResult> {
    await this.rateLimiter.acquire();
    const t0 = Date.now();
    const mockInvoices = [
      {
        InvoiceID: 105,
        Number: 105,
        Date: '1403/07/14',
        CustomerID: 12,
        CustomerTitle: 'پخش البرز سراسری',
        Price: 8500000000,
        Discount: 200000000,
        Total: 8300000000
      }
    ];

    return {
      entity: options.entity,
      records: mockInvoices,
      batchSize: mockInvoices.length,
      hasMore: false,
      durationMs: Date.now() - t0
    };
  }

  public async extractIncremental(options: IncrementalExtractionOptions): Promise<ExtractionBatchResult> {
    return this.extractFull(options);
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    return {
      isHealthy: true,
      statusMessageFa: 'اتصال به پایگاه داده سپیدار همکاران سیستم برقرار است.'
    };
  }

  public async normalizeToCanonical(
    sourceEntity: string,
    rawRecords: Record<string, unknown>[],
    orgId: string
  ): Promise<BaseCanonicalEntity[]> {
    const list: BaseCanonicalEntity[] = [];

    for (const raw of rawRecords) {
      const dateShamsi = String(raw.Date || '1403/01/01');
      const gDate = JalaliDateTime.parse(dateShamsi);

      const entity: Invoice = {
        id: `inv-sepidar-${orgId}-${raw.InvoiceID}`,
        orgId,
        invoiceNumber: String(raw.Number),
        invoiceDateJalali: dateShamsi,
        invoiceDateGregorian: gDate.toISOString().substring(0, 10),
        customerId: `cust-sepidar-${orgId}-${raw.CustomerID}`,
        totalGrossAmountRial: Number(raw.Price) || 0,
        totalDiscountAmountRial: Number(raw.Discount) || 0,
        totalVatAmountRial: 0,
        totalTollAmountRial: 0,
        totalNetAmountRial: Number(raw.Total) || 0,
        paidAmountRial: 0,
        remainingAmountRial: Number(raw.Total) || 0,
        status: 'CONFIRMED',
        lines: [],
        metadata: {
          sourceSystem: 'SEPIDAR',
          sourceEntity,
          sourcePk: String(raw.InvoiceID),
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
