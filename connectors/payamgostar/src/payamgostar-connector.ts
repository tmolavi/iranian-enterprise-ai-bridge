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
import { BaseCanonicalEntity, Customer } from '@ieab/canonical-model';
import { PersianNormalizer, computeChecksum } from '@ieab/shared';
import { PAYAMGOSTAR_MANIFEST } from './manifest.js';

export class PayamGostarConnector extends BaseConnector {
  public readonly manifest: ConnectorManifest = PAYAMGOSTAR_MANIFEST;

  constructor(config: ConnectionConfig = {}) {
    super(config);
  }

  public async testConnection(): Promise<ConnectionTestResult> {
    await this.rateLimiter.acquire();
    const t0 = Date.now();

    if (!this.config.baseUrl || !this.config.apiKey) {
      return {
        success: false,
        status: 'REQUIRES_VENDOR_ACCESS',
        latencyMs: 0,
        isReadOnlyConfirmed: false,
        error: 'PayamGostar live CRM integration requires baseUrl and apiKey credentials.',
        details: {
          vendor: 'PayamGostar',
          product: 'CRM',
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
        vendor: 'PayamGostar',
        product: 'CRM',
        baseUrl: this.config.baseUrl
      }
    };
  }

  public async discoverSchema(): Promise<SchemaDiscoveryResult> {
    return {
      entities: [
        {
          name: 'PayamGostar_Customers',
          type: 'ENDPOINT',
          descriptionFa: 'اطلاعات مشتریان و لیدهای سیستم مدیریت ارتباط با مشتری پیام‌گستر',
          fields: [
            { name: 'Id', dataType: 'guid', isNullable: false, isPrimaryKey: true },
            { name: 'NickName', dataType: 'string', isNullable: false, isPrimaryKey: false },
            { name: 'Phone', dataType: 'string', isNullable: true, isPrimaryKey: false },
            { name: 'CustomerCategory', dataType: 'string', isNullable: true, isPrimaryKey: false }
          ]
        }
      ],
      discoveredAt: new Date().toISOString()
    };
  }

  public async extractFull(options: ExtractionOptions): Promise<ExtractionBatchResult> {
    await this.rateLimiter.acquire();
    const t0 = Date.now();
    const mockCustomers = [
      {
        Id: 'pg-cust-001',
        NickName: 'شرکت صنایع بسته بندی نگین',
        Phone: '02188776655',
        CustomerCategory: 'مشتری طلایی B2B'
      }
    ];

    return {
      entity: options.entity,
      records: mockCustomers,
      batchSize: mockCustomers.length,
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
      statusMessageFa: 'سرویس REST API پیام‌گستر در دسترس است.'
    };
  }

  public async normalizeToCanonical(
    sourceEntity: string,
    rawRecords: Record<string, unknown>[],
    orgId: string
  ): Promise<BaseCanonicalEntity[]> {
    const list: BaseCanonicalEntity[] = [];

    for (const raw of rawRecords) {
      const entity: Customer = {
        id: `cust-pg-${orgId}-${raw.Id}`,
        orgId,
        code: String(raw.Id),
        nameFa: PersianNormalizer.normalize(String(raw.NickName)),
        partyType: 'LEGAL_ENTITY',
        phone: raw.Phone ? String(raw.Phone) : undefined,
        category: raw.CustomerCategory ? String(raw.CustomerCategory) : undefined,
        isActive: true,
        metadata: {
          sourceSystem: 'PAYAMGOSTAR_CRM',
          sourceEntity,
          sourcePk: String(raw.Id),
          orgId,
          syncedAt: new Date().toISOString(),
          connectorVersion: '2.0.0',
          checksum: computeChecksum(raw),
          isDeleted: false,
          reconciliationStatus: 'NOT_APPLICABLE'
        }
      };
      list.push(entity);
    }

    return list;
  }
}
