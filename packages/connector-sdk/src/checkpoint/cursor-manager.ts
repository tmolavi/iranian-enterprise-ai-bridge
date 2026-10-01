/**
 * Cursor & Watermark Checkpoint Manager for Resilient Incremental Sync.
 */

export interface SyncCheckpoint {
  connectorId: string;
  orgId: string;
  entity: string;
  lastSyncTimestamp: string;
  cursorField: string;
  cursorValue: string | number;
  recordsSyncedTotal: number;
  lastBatchCount: number;
  updatedAt: string;
}

export class CheckpointManager {
  private checkpoints: Map<string, SyncCheckpoint> = new Map();

  private getKey(orgId: string, connectorId: string, entity: string): string {
    return `${orgId}:${connectorId}:${entity}`;
  }

  public getCheckpoint(orgId: string, connectorId: string, entity: string): SyncCheckpoint | undefined {
    return this.checkpoints.get(this.getKey(orgId, connectorId, entity));
  }

  public updateCheckpoint(
    orgId: string,
    connectorId: string,
    entity: string,
    cursorField: string,
    cursorValue: string | number,
    batchCount: number
  ): SyncCheckpoint {
    const key = this.getKey(orgId, connectorId, entity);
    const existing = this.checkpoints.get(key);

    const now = new Date().toISOString();
    const updated: SyncCheckpoint = {
      connectorId,
      orgId,
      entity,
      lastSyncTimestamp: now,
      cursorField,
      cursorValue,
      recordsSyncedTotal: (existing?.recordsSyncedTotal || 0) + batchCount,
      lastBatchCount: batchCount,
      updatedAt: now
    };

    this.checkpoints.set(key, updated);
    return updated;
  }

  public clear(orgId: string, connectorId: string, entity?: string): void {
    if (entity) {
      this.checkpoints.delete(this.getKey(orgId, connectorId, entity));
    } else {
      const prefix = `${orgId}:${connectorId}:`;
      for (const key of this.checkpoints.keys()) {
        if (key.startsWith(prefix)) {
          this.checkpoints.delete(key);
        }
      }
    }
  }
}
