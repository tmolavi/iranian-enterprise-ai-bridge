/**
 * Executes an asynchronous function with exponential backoff and jitter.
 */
export declare function retryWithBackoff<T>(fn: () => Promise<T>, options?: {
    retries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    factor?: number;
    onRetry?: (error: Error, attempt: number) => void;
}): Promise<T>;
/**
 * Split array into chunks of specified size.
 */
export declare function chunkArray<T>(items: T[], chunkSize: number): T[][];
/**
 * Compute SHA256 checksum of an object or string for data lineage & idempotency.
 */
export declare function computeChecksum(val: unknown): string;
//# sourceMappingURL=index.d.ts.map