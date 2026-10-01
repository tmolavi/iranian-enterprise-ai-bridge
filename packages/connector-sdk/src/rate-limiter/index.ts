/**
 * Token Bucket Rate Limiter with Backoff for ERP protection.
 * Ensures the Bridge never overwhelms production ERP database / API servers.
 */

export class ERPProtectionRateLimiter {
  private capacity: number;
  private tokens: number;
  private refillRatePerSecond: number;
  private lastRefillTimestamp: number;

  constructor(maxRequestsPerSecond = 10, burstCapacity = 20) {
    this.capacity = burstCapacity;
    this.tokens = burstCapacity;
    this.refillRatePerSecond = maxRequestsPerSecond;
    this.lastRefillTimestamp = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsedTime = (now - this.lastRefillTimestamp) / 1000;
    const tokensToAdd = elapsedTime * this.refillRatePerSecond;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTimestamp = now;
  }

  public async acquire(tokensNeeded = 1): Promise<void> {
    while (true) {
      this.refill();
      if (this.tokens >= tokensNeeded) {
        this.tokens -= tokensNeeded;
        return;
      }
      const missing = tokensNeeded - this.tokens;
      const waitMs = Math.ceil((missing / this.refillRatePerSecond) * 1000);
      await new Promise((resolve) => setTimeout(resolve, Math.max(waitMs, 50)));
    }
  }
}
