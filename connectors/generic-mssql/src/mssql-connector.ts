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
import { GENERIC_MSSQL_MANIFEST } from './manifest.js';

export class GenericMSSQLConnector extends BaseConnector {
  public readonly manifest: ConnectorManifest = GENERIC_MSSQL_MANIFEST;

  constructor(config: ConnectionConfig = {}) {
    super(config);
  }

  public async testConnection(): Promise<ConnectionTestResult> {
    await this.rateLimiter.acquire();
    const t0 = Date.now();

    // Verify configuration presence
    if (!this.config.host || !this.config.database || !this.config.username) {
      return {
        success: false,
        status: 'NOT_CONFIGURED',
        latencyMs: 0,
        isReadOnlyConfirmed: false,
        error: 'Database connection parameters (host, database, username) are not configured.',
        details: {
          configuredHost: this.config.host || null,
          configuredDatabase: this.config.database || null
        }
      };
    }

    const isReadOnly = this.config.readOnlyIntent !== false;

    // In v0.1 without active live network database verification, report NOT_VERIFIED honestly.
    return {
      success: false,
      status: 'NOT_VERIFIED',
      latencyMs: Date.now() - t0,
      isReadOnlyConfirmed: isReadOnly,
      error: 'Live SQL Server driver validation is pending network execution in v0.1. Use testFixtureConnection() for synthetic fixture verification.',
      details: {
        host: this.config.host,
        database: this.config.database,
        status: 'NOT_VERIFIED'
      }
    };
  }

  public async discoverSchema(entity?: string): Promise<SchemaDiscoveryResult> {
    await this.rateLimiter.acquire();

    const entities = [
      {
        name: 'vw_IEAB_SalesInvoices',
        type: 'VIEW' as const,
        descriptionFa: 'نمای استاندارد فاکتورهای فروش و مبالغ ناخالص/خالص',
        rowCountEstimate: 145000,
        fields: [
          { name: 'InvoiceID', dataType: 'bigint', isNullable: false, isPrimaryKey: true },
          { name: 'InvoiceNumber', dataType: 'nvarchar(50)', isNullable: false, isPrimaryKey: false },
          { name: 'InvoiceDateShamsi', dataType: 'varchar(10)', isNullable: false, isPrimaryKey: false },
          { name: 'CustomerID', dataType: 'bigint', isNullable: false, isPrimaryKey: false },
          { name: 'CustomerName', dataType: 'nvarchar(200)', isNullable: false, isPrimaryKey: false },
          { name: 'GrossAmountRial', dataType: 'decimal(18,0)', isNullable: false, isPrimaryKey: false },
          { name: 'DiscountAmountRial', dataType: 'decimal(18,0)', isNullable: false, isPrimaryKey: false },
          { name: 'NetAmountRial', dataType: 'decimal(18,0)', isNullable: false, isPrimaryKey: false },
          { name: 'Status', dataType: 'int', isNullable: false, isPrimaryKey: false },
          { name: 'ModifiedDate', dataType: 'datetime2', isNullable: false, isPrimaryKey: false }
        ]
      },
      {
        name: 'vw_IEAB_Customers',
        type: 'VIEW' as const,
        descriptionFa: 'نمای استاندارد مشتریان، شناسه ملی و اطلاعات تماس',
        rowCountEstimate: 1200,
        fields: [
          { name: 'CustomerID', dataType: 'bigint', isNullable: false, isPrimaryKey: true },
          { name: 'CustomerCode', dataType: 'nvarchar(50)', isNullable: false, isPrimaryKey: false },
          { name: 'CustomerName', dataType: 'nvarchar(200)', isNullable: false, isPrimaryKey: false },
          { name: 'NationalID', dataType: 'varchar(11)', isNullable: true, isPrimaryKey: false },
          { name: 'EconomicCode', dataType: 'varchar(14)', isNullable: true, isPrimaryKey: false },
          { name: 'CreditLimitRial', dataType: 'decimal(18,0)', isNullable: true, isPrimaryKey: false },
          { name: 'IsActive', dataType: 'bit', isNullable: false, isPrimaryKey: false }
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
    const batchSize = options.batchSize || 100;
    const offset = options.offset || 0;

    // Simulated realistic MSSQL extraction records with Persian characters & Shamsi dates
    const mockDbRecords: Record<string, unknown>[] = [
      {
        InvoiceID: 1001,
        InvoiceNumber: 'INV-1403-1001',
        InvoiceDateShamsi: '1403/07/10',
        CustomerID: 501,
        CustomerName: 'شركت بازرگاني كاوه‌فولاد', // Contains Arabic Yeh/Kaf to test normalization
        GrossAmountRial: 25000000000,
        DiscountAmountRial: 1000000000,
        NetAmountRial: 26400000000,
        Status: 2, // Confirmed
        ModifiedDate: '2024-10-01T14:30:00Z'
      },
      {
        InvoiceID: 1002,
        InvoiceNumber: 'INV-1403-1002',
        InvoiceDateShamsi: '1403/07/12',
        CustomerID: 502,
        CustomerName: 'صنایع فلزی زاگرس',
        GrossAmountRial: 15000000000,
        DiscountAmountRial: 500000000,
        NetAmountRial: 15950000000,
        Status: 2,
        ModifiedDate: '2024-10-03T09:15:00Z'
      }
    ];

    return {
      entity: options.entity,
      records: mockDbRecords,
      recordsCount: mockDbRecords.length,
      batchSize: mockDbRecords.length,
      hasMore: false,
      nextCursor: 1002,
      extractedAt: new Date().toISOString(),
      durationMs: Date.now() - t0,
      isFixture: true
    };
  }

  public async extractIncremental(options: IncrementalExtractionOptions): Promise<ExtractionBatchResult> {
    return this.extractFull(options);
  }

  public async healthCheck(): Promise<HealthCheckResult> {
    const connTest = await this.testConnection();
    return {
      connectorId: this.manifest.connectorId,
      status: connTest.success ? 'HEALTHY' : (connTest.status === 'NOT_VERIFIED' ? 'NOT_VERIFIED' : 'NOT_CONFIGURED'),
      isHealthy: connTest.success,
      checkedAt: new Date().toISOString(),
      connection: connTest,
      lastSyncTimestamp: new Date().toISOString(),
      reconciliationStatus: 'NOT_VERIFIED'
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

      if (sourceEntity.toLowerCase().includes('invoice')) {
        const dateShamsi = String(raw.InvoiceDateShamsi || '1403/01/01');
        const parsedGDate = JalaliDateTime.parse(dateShamsi);

        const entity: Invoice = {
          id: `inv-${orgId}-${raw.InvoiceID}`,
          orgId,
          invoiceNumber: String(raw.InvoiceNumber),
          invoiceDateJalali: dateShamsi,
          invoiceDateGregorian: parsedGDate.toISOString().substring(0, 10),
          customerId: `cust-${orgId}-${raw.CustomerID}`,
          totalGrossAmountRial: Number(raw.GrossAmountRial) || 0,
          totalDiscountAmountRial: Number(raw.DiscountAmountRial) || 0,
          totalVatAmountRial: (Number(raw.NetAmountRial) || 0) - (Number(raw.GrossAmountRial) || 0) + (Number(raw.DiscountAmountRial) || 0),
          totalTollAmountRial: 0,
          totalNetAmountRial: Number(raw.NetAmountRial) || 0,
          paidAmountRial: 0,
          remainingAmountRial: Number(raw.NetAmountRial) || 0,
          status: 'CONFIRMED',
          lines: [],
          metadata: {
            sourceSystem: 'GENERIC_MSSQL',
            sourceEntity,
            sourcePk: String(raw.InvoiceID),
            orgId,
            syncedAt: nowIso,
            connectorVersion: this.manifest.versionsTested[0],
            checksum,
            isDeleted: false,
            reconciliationStatus: 'NOT_VERIFIED'
          }
        };

        canonicalList.push(entity);
      } else if (sourceEntity.toLowerCase().includes('customer')) {
        const entity: Customer = {
          id: `cust-${orgId}-${raw.CustomerID}`,
          orgId,
          code: String(raw.CustomerCode || raw.CustomerID),
          nameFa: PersianNormalizer.normalize(String(raw.CustomerName)),
          partyType: 'LEGAL_ENTITY',
          nationalId: raw.NationalID ? String(raw.NationalID) : undefined,
          economicCode: raw.EconomicCode ? String(raw.EconomicCode) : undefined,
          creditLimitRial: Number(raw.CreditLimitRial) || 0,
          isActive: Boolean(raw.IsActive),
          metadata: {
            sourceSystem: 'GENERIC_MSSQL',
            sourceEntity,
            sourcePk: String(raw.CustomerID),
            orgId,
            syncedAt: nowIso,
            connectorVersion: this.manifest.versionsTested[0],
            checksum,
            isDeleted: false,
            reconciliationStatus: 'NOT_VERIFIED'
          }
        };

        canonicalList.push(entity);
      }
    }

    return canonicalList;
  }
}
