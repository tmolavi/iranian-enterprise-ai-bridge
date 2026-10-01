import assert from 'node:assert/strict';
import { BaseConnector } from '../base/base-connector.js';

export interface HarnessValidationReport {
  connectorId: string;
  testedAt: string;
  passed: boolean;
  checks: Array<{
    name: string;
    passed: boolean;
    durationMs: number;
    error?: string;
  }>;
}

export class ConnectorTestHarness {
  public static async runSuite(connector: BaseConnector, testEntity: string, orgId = 'org-test-01'): Promise<HarnessValidationReport> {
    const checks: HarnessValidationReport['checks'] = [];
    const manifest = connector.getManifest();

    // Check 1: Manifest Integrity
    const t0 = Date.now();
    try {
      assert.ok(manifest.connectorId, 'Manifest must have connectorId');
      assert.ok(manifest.vendor, 'Manifest must have vendor');
      assert.ok(manifest.product, 'Manifest must have product');
      assert.ok(manifest.evidenceLevel, 'Manifest must declare evidence level');
      assert.ok(manifest.status, 'Manifest must declare status');
      checks.push({ name: 'Manifest Integrity Check', passed: true, durationMs: Date.now() - t0 });
    } catch (e: any) {
      checks.push({ name: 'Manifest Integrity Check', passed: false, durationMs: Date.now() - t0, error: e.message });
    }

    // Check 2: Connection Test (Live or Fixture Mode)
    const t1 = Date.now();
    try {
      const conn = await connector.testConnection();
      if (!conn.success && (conn.status === 'NOT_CONFIGURED' || conn.status === 'REQUIRES_VENDOR_ACCESS')) {
        const fixtureConn = connector.testFixtureConnection();
        assert.ok(fixtureConn.success, 'Fixture connection test should return success');
        assert.ok(fixtureConn.isReadOnlyConfirmed, 'Read-only safety must be confirmed');
        checks.push({ name: 'Connection Test (Verified Fixture Mode)', passed: true, durationMs: Date.now() - t1 });
      } else {
        assert.ok(conn.success, 'Connection test should return success');
        assert.ok(conn.isReadOnlyConfirmed, 'Read-only connection must be confirmed');
        checks.push({ name: 'Read-Only Live Connection Test', passed: true, durationMs: Date.now() - t1 });
      }
    } catch (e: any) {
      checks.push({ name: 'Connection Test', passed: false, durationMs: Date.now() - t1, error: e.message });
    }

    // Check 3: Schema Discovery
    const t2 = Date.now();
    try {
      const schema = await connector.discoverSchema();
      assert.ok(schema.entities.length > 0, 'Schema discovery must return at least 1 entity');
      checks.push({ name: 'Schema Discovery', passed: true, durationMs: Date.now() - t2 });
    } catch (e: any) {
      checks.push({ name: 'Schema Discovery', passed: false, durationMs: Date.now() - t2, error: e.message });
    }

    // Check 4: Full Batch Extraction & Normalization
    const t3 = Date.now();
    try {
      const batch = await connector.extractFull({ entity: testEntity, batchSize: 10 });
      assert.ok(Array.isArray(batch.records), 'Batch records must be an array');
      const canonical = await connector.normalizeToCanonical(testEntity, batch.records, orgId);
      assert.ok(Array.isArray(canonical), 'Normalized records must be an array');
      if (canonical.length > 0) {
        assert.ok(canonical[0].metadata.sourceSystem, 'Metadata sourceSystem must be set');
        assert.ok(canonical[0].metadata.checksum, 'Metadata checksum must be set');
        assert.equal(canonical[0].orgId, orgId, 'orgId must match');
      }
      checks.push({ name: 'Extraction & Canonical Mapping', passed: true, durationMs: Date.now() - t3 });
    } catch (e: any) {
      checks.push({ name: 'Extraction & Canonical Mapping', passed: false, durationMs: Date.now() - t3, error: e.message });
    }

    // Check 5: Health Check
    const t4 = Date.now();
    try {
      const health = await connector.healthCheck();
      assert.ok(typeof health.status === 'string', 'Health status must be string enum');
      checks.push({ name: 'Health Check Verification', passed: true, durationMs: Date.now() - t4 });
    } catch (e: any) {
      checks.push({ name: 'Health Check Verification', passed: false, durationMs: Date.now() - t4, error: e.message });
    }

    const allPassed = checks.every((c) => c.passed);
    return {
      connectorId: manifest.connectorId,
      testedAt: new Date().toISOString(),
      passed: allPassed,
      checks
    };
  }
}
