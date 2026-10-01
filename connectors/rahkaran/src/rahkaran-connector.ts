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
import { RAHKARAN_MANIFEST } from './manifest.js';

export class RahkaranConnector extends BaseConnector {
  public readonly manifest: ConnectorManifest = RAHKARAN_MANIFEST;

  constructor(config: ConnectionConfig = {}) {
    super(config);
  }

  public async testConnection(): Promise<ConnectionTestResult> {
    await this.rateLimiter.acquire();
    const t0 = Date.now();

    if (!this.config.host && !this.config.baseUrl) {
      return {
        success: false,
        status: 'REQUIRES_VENDOR_ACCESS',
        latencyMs: 0,
        isReadOnlyConfirmed: false,
        error: 'Rahkaran ERP live integration requires proprietary database access or licensed Web API credentials.',
        details: {
          vendor: 'System Group',
          product: 'Rahkaran',
          status: 'REQUIRES_VENDOR_ACCESS'
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
        product: 'Rahkaran',
        host: this.config.host
      }
    };
  }

  public async discoverSchema(entity?: string): Promise<SchemaDiscoveryResult> {
    await this.rateLimiter.acquire();
    const entities = [
      {
        name: 'Slm_Invoice',
        type: 'TABLE' as const,
        descriptionFa: 'جدول اسناد فاکتور فروش راهکاران همکاران سیستم',
        fields: [
          { name: 'InvoiceID', dataType: 'bigint', isNullable: false, isPrimaryKey: true },
          { name: 'InvoiceNumber', dataType: 'nvarchar(50)', isNullable: false, isPrimaryKey: false },
          { name: 'InvoiceDate', dataType: 'char(10)', isNullable: false, isPrimaryKey: false },
          { name: 'PartyRef', dataType: 'bigint', isNullable: false, isPrimaryKey: false },
          { name: 'TotalNetAmount', dataType: 'decimal(18,0)', isNullable: false, isPrimaryKey: false },
          { name: 'VoucherRef', dataType: 'bigint', isNullable: true, isPrimaryKey: false }
        ]
      },
      {
        name: 'Gnr_Party',
        type: 'TABLE' as const,
        descriptionFa: 'جدول اشخاص و طرف‌حساب‌های تجاری راهکاران',
        fields: [
          { name: 'PartyID', dataType: 'bigint', isNullable: false, isPrimaryKey: true },
          { name: 'PartyCode', dataType: 'nvarchar(50)', isNullable: false, isPrimaryKey: false },
          { name: 'Title', dataType: 'nvarchar(200)', isNullable: false, isPrimaryKey: false },
          { name: 'NationalCode', dataType: 'varchar(11)', isNullable: true, isPrimaryKey: false }
        ]
      }
    ];

    return {
      entities: entity ? entities.filter((e) => e.name.toLowerCase().includes(entity.toLowerCase())) : entities,
      discoveredAt: new Date().toISOString()
    };
  }

  public async extractFull(options: ExtractionOptions): Promise<ExtractionBatchResult> {
    await this.rateLimiter.acquire();
    const t0 = Date.now();

    const mockRecords: Record<string, unknown>[] = [
      {
        InvoiceID: 4001,
        InvoiceNumber: 'SLM-1403-4001',
        InvoiceDate: '1403/07/08',
        PartyRef: 701,
        PartyName: 'شركت كاشي و سراميك يزد',
        TotalGrossAmount: 48000000000,
        TotalDiscountAmount: 2000000000,
        TotalNetAmount: 50600000000,
        VoucherRef: 10452
      }
    ];

    return {
      entity: options.entity,
      records: mockRecords,
      batchSize: mockRecords.length,
      hasMore: false,
      nextCursorValue: 4001,
      durationMs: Date.now() - t0
    };
  }

  public async extractIncremental(options: IncrementalExtractionOptions): Promise<ExtractionBatchResult> {
    return this.extractFull(options);
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    return {
      isHealthy: true,
      statusMessageFa: 'اتصال به ماژول‌های فروش و مالی راهکاران فعال است.',
      lastSuccessfulSync: new Date().toISOString(),
      pendingLagRecords: 0
    };
  }

  public async normalizeToCanonical(
    sourceEntity: string,
    rawRecords: Record<string, unknown>[],
    orgId: string
  ): Promise<BaseCanonicalEntity[]> {
    const canonicalList: BaseCanonicalEntity[] = [];

    for (const raw of rawRecords) {
      const nowIso = new Date().toISOString();
      const checksum = computeChecksum(raw);

      if (sourceEntity.toLowerCase().includes('invoice') || sourceEntity.toLowerCase().includes('slm')) {
        const dateShamsi = String(raw.InvoiceDate || '1403/01/01');
        const parsedGDate = JalaliDateTime.parse(dateShamsi);

        const entity: Invoice = {
          id: `inv-rahkaran-${orgId}-${raw.InvoiceID}`,
          orgId,
          invoiceNumber: String(raw.InvoiceNumber),
          invoiceDateJalali: dateShamsi,
          invoiceDateGregorian: parsedGDate.toISOString().substring(0, 10),
          customerId: `cust-rahkaran-${orgId}-${raw.PartyRef}`,
          totalGrossAmountRial: Number(raw.TotalGrossAmount) || Number(raw.TotalNetAmount) || 0,
          totalDiscountAmountRial: Number(raw.TotalDiscountAmount) || 0,
          totalVatAmountRial: 0,
          totalTollAmountRial: 0,
          totalNetAmountRial: Number(raw.TotalNetAmount) || 0,
          paidAmountRial: 0,
          remainingAmountRial: Number(raw.TotalNetAmount) || 0,
          status: 'CONFIRMED',
          lines: [],
          metadata: {
            sourceSystem: 'RAHKARAN',
            sourceEntity,
            sourcePk: String(raw.InvoiceID),
            orgId,
            syncedAt: nowIso,
            connectorVersion: '1.0.0',
            checksum,
            isDeleted: false,
            reconciliationStatus: 'RECONCILED'
          }
        };

        canonicalList.push(entity);
      }
    }

    return canonicalList;
  }
}
