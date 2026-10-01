import { createHash } from 'node:crypto';

/**
 * Executes an asynchronous function with exponential backoff and jitter.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    factor?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const retries = options.retries ?? 3;
  const initialDelay = options.initialDelayMs ?? 500;
  const maxDelay = options.maxDelayMs ?? 10000;
  const factor = options.factor ?? 2;

  let attempt = 0;
  let delay = initialDelay;

  while (true) {
    try {
      return await fn();
    } catch (err: unknown) {
      attempt++;
      if (attempt > retries) {
        throw err;
      }
      const errorObj = err instanceof Error ? err : new Error(String(err));
      if (options.onRetry) {
        options.onRetry(errorObj, attempt);
      }
      const jitter = Math.random() * 200;
      const actualDelay = Math.min(delay + jitter, maxDelay);
      await new Promise((resolve) => setTimeout(resolve, actualDelay));
      delay *= factor;
    }
  }
}

/**
 * Split array into chunks of specified size.
 */
export function chunkArray<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Compute SHA256 checksum of an object or string for data lineage & idempotency.
 */
export function computeChecksum(val: unknown): string {
  const str = typeof val === 'string' ? val : JSON.stringify(val);
  return createHash('sha256').update(str).digest('hex');
}
