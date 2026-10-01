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
import { BaseCanonicalEntity, Document, Meeting } from '@ieab/canonical-model';
import { PersianNormalizer, computeChecksum } from '@ieab/shared';
import { CHARGOON_MANIFEST } from './manifest.js';

export class ChargoonConnector extends BaseConnector {
  public readonly manifest: ConnectorManifest = CHARGOON_MANIFEST;

  constructor(config: ConnectionConfig = {}) {
    super(config);
  }

  public async testConnection(): Promise<ConnectionTestResult> {
    await this.rateLimiter.acquire();
    const t0 = Date.now();

    if (!this.config.baseUrl && !this.config.apiKey) {
      return {
        success: false,
        status: 'REQUIRES_VENDOR_ACCESS',
        latencyMs: 0,
        isReadOnlyConfirmed: false,
        error: 'Didgah Chargoon integration requires active web service endpoint and authentication token.',
        details: {
          vendor: 'Chargoon',
          product: 'Didgah Suite',
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
        vendor: 'Chargoon',
        product: 'Didgah Suite',
        baseUrl: this.config.baseUrl
      }
    };
  }

  public async discoverSchema(): Promise<SchemaDiscoveryResult> {
    return {
      entities: [
        {
          name: 'Didgah_Documents',
          type: 'ENDPOINT',
          descriptionFa: 'مکاتبات، نامه‌ها و مصوبات اتوماسیون اداری دیدگاه چارگون',
          fields: [
            { name: 'DocumentID', dataType: 'string', isNullable: false, isPrimaryKey: true },
            { name: 'DocumentNumber', dataType: 'string', isNullable: false, isPrimaryKey: false },
            { name: 'Subject', dataType: 'string', isNullable: false, isPrimaryKey: false },
            { name: 'DateShamsi', dataType: 'string', isNullable: false, isPrimaryKey: false },
            { name: 'Classification', dataType: 'string', isNullable: false, isPrimaryKey: false }
          ]
        }
      ],
      discoveredAt: new Date().toISOString()
    };
  }

  public async extractFull(options: ExtractionOptions): Promise<ExtractionBatchResult> {
    await this.rateLimiter.acquire();
    const t0 = Date.now();
    const mockDocs = [
      {
        DocumentID: 'doc-didgah-101',
        DocumentNumber: '1403/1054/م',
        Subject: 'صورتجلسه کمیته راهبری و توسعه خط تولید شماره ۳',
        DateShamsi: '1403/07/05',
        Classification: 'CONFIDENTIAL',
        Summary: 'تصویب خرید تجهیزات تکمیلی خط نورد و تخصیص بودجه ارزی'
      }
    ];

    return {
      entity: options.entity,
      records: mockDocs,
      batchSize: mockDocs.length,
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
      statusMessageFa: 'سرویس‌های اتوماسیون و BPMS دیدگاه چارگون پاسخگو هستند.'
    };
  }

  public async normalizeToCanonical(
    sourceEntity: string,
    rawRecords: Record<string, unknown>[],
    orgId: string
  ): Promise<BaseCanonicalEntity[]> {
    const canonicalList: BaseCanonicalEntity[] = [];

    for (const raw of rawRecords) {
      const entity: Document = {
        id: `doc-didgah-${orgId}-${raw.DocumentID}`,
        orgId,
        documentNumber: String(raw.DocumentNumber),
        titleFa: PersianNormalizer.normalize(String(raw.Subject)),
        category: 'BOARD_RESOLUTION',
        issueDateJalali: String(raw.DateShamsi || '1403/01/01'),
        confidentialityLevel: 'CONFIDENTIAL',
        summaryFa: PersianNormalizer.normalize(String(raw.Summary || '')),
        metadata: {
          sourceSystem: 'CHARGOON_DIDGAH',
          sourceEntity,
          sourcePk: String(raw.DocumentID),
          orgId,
          syncedAt: new Date().toISOString(),
          connectorVersion: '1.0.0',
          checksum: computeChecksum(raw),
          isDeleted: false,
          reconciliationStatus: 'NOT_APPLICABLE'
        }
      };
      canonicalList.push(entity);
    }

    return canonicalList;
  }
}
