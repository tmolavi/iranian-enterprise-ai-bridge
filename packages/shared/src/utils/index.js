"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryWithBackoff = retryWithBackoff;
exports.chunkArray = chunkArray;
exports.computeChecksum = computeChecksum;
const node_crypto_1 = require("node:crypto");
/**
 * Executes an asynchronous function with exponential backoff and jitter.
 */
async function retryWithBackoff(fn, options = {}) {
    const retries = options.retries ?? 3;
    const initialDelay = options.initialDelayMs ?? 500;
    const maxDelay = options.maxDelayMs ?? 10000;
    const factor = options.factor ?? 2;
    let attempt = 0;
    let delay = initialDelay;
    while (true) {
        try {
            return await fn();
        }
        catch (err) {
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
function chunkArray(items, chunkSize) {
    const chunks = [];
    for (let i = 0; i < items.length; i += chunkSize) {
        chunks.push(items.slice(i, i + chunkSize));
    }
    return chunks;
}
/**
 * Compute SHA256 checksum of an object or string for data lineage & idempotency.
 */
function computeChecksum(val) {
    const str = typeof val === 'string' ? val : JSON.stringify(val);
    return (0, node_crypto_1.createHash)('sha256').update(str).digest('hex');
}
//# sourceMappingURL=index.js.map