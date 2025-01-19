export class RateLimiter {
  private timestamps: number[] = [];
  private readonly windowMs = 60 * 1000; // 1 minute window

  constructor(private readonly maxRequests: number) {}

  tryAcquire(): boolean {
    const now = Date.now();
    
    // Remove timestamps outside the current window
    this.timestamps = this.timestamps.filter(
      timestamp => now - timestamp < this.windowMs
    );

    if (this.timestamps.length >= this.maxRequests) {
      return false;
    }

    this.timestamps.push(now);
    return true;
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(
      timestamp => now - timestamp < this.windowMs
    );
    return Math.max(0, this.maxRequests - this.timestamps.length);
  }
}
