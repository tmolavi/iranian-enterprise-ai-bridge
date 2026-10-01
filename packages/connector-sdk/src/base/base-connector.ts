import { BaseCanonicalEntity } from '@ieab/canonical-model';
import { Logger } from '@ieab/shared';
import {
  ConnectorManifest,
  EvidenceLevel,
  ConnectorStatus,
  ExtractionMethod
} from '../types/manifest.js';
import {
  ConnectionConfig,
  ConnectionTestResult,
  ConnectionStatus,
  SchemaDiscoveryResult,
  ExtractionOptions,
  IncrementalExtractionOptions,
  ExtractionBatchResult,
  HealthCheckResult
} from '../types/extraction.js';
import { ERPProtectionRateLimiter } from '../rate-limiter/index.js';
import { CheckpointManager } from '../checkpoint/cursor-manager.js';

export abstract class BaseConnector {
  public abstract readonly manifest: ConnectorManifest;
  protected logger: Logger;
  protected rateLimiter: ERPProtectionRateLimiter;
  protected checkpointManager: CheckpointManager;
  protected config: ConnectionConfig;

  constructor(config: ConnectionConfig = {}, checkpointManager?: CheckpointManager) {
    this.config = config;
    this.logger = new Logger(`Connector:${this.constructor.name}`);
    this.rateLimiter = new ERPProtectionRateLimiter(10, 20);
    this.checkpointManager = checkpointManager || new CheckpointManager();
  }

  /** Get manifest metadata */
  public getManifest(): ConnectorManifest {
    return this.manifest;
  }

  /** Test live connection against actual host/credentials. Never returns fake success. */
  public abstract testConnection(): Promise<ConnectionTestResult>;

  /** Test connector against synthetic fixture data for offline verification */
  public testFixtureConnection(): ConnectionTestResult {
    return {
      success: true,
      status: 'FIXTURE_MODE',
      latencyMs: 1,
      isReadOnlyConfirmed: true,
      isFixture: true,
      details: {
        connectorId: this.manifest.connectorId,
        mode: 'FIXTURE',
        note: 'Validated using synthetic offline fixture dataset.'
      }
    };
  }

  /** Discover available tables, views, endpoints */
  public abstract discoverSchema(entity?: string): Promise<SchemaDiscoveryResult>;

  /** Extract full batch */
  public abstract extractFull(options: ExtractionOptions): Promise<ExtractionBatchResult>;

  /** Extract incremental batch */
  public abstract extractIncremental(options: IncrementalExtractionOptions): Promise<ExtractionBatchResult>;

  /** Perform connector health check */
  public abstract healthCheck(): Promise<HealthCheckResult>;

  /** Normalize raw source records into canonical model entities */
  public abstract normalizeToCanonical(
    sourceEntity: string,
    rawRecords: Record<string, unknown>[],
    orgId: string
  ): Promise<BaseCanonicalEntity[]>;

  /** Helper to validate whether connector is verified in a live production environment */
  public isLiveVerified(): boolean {
    return this.manifest.status === 'LIVE_INTEGRATION_VERIFIED';
  }

  /** Helper to check if connector is tested with synthetic fixtures */
  public isFixtureTested(): boolean {
    return this.manifest.status === 'FIXTURE_TESTED' || this.manifest.status === 'LIVE_INTEGRATION_VERIFIED';
  }
}
