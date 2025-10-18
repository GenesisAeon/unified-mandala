export type CircuitBreakerState = 'closed' | 'open' | 'half_open';

export interface CircuitBreakerOptions {
  failureThreshold?: number;
  halfOpenAfterMs?: number;
  successReset?: number;
}

export class CircuitBreaker {
  private state: CircuitBreakerState = 'closed';
  private failures = 0;
  private successesWhileHalfOpen = 0;
  private lastOpenedAt = 0;
  private options: CircuitBreakerOptions;

  constructor(options: CircuitBreakerOptions = {}) {
    this.options = { ...options };
  }

  configure(options: CircuitBreakerOptions): void {
    this.options = { ...this.options, ...options };
  }

  getState(): CircuitBreakerState {
    return this.state;
  }

  canRequest(): boolean {
    if (this.state === 'closed') {
      return true;
    }

    if (this.state === 'open') {
      const halfOpenAfterMs = this.options.halfOpenAfterMs ?? 10_000;
      if (Date.now() - this.lastOpenedAt >= halfOpenAfterMs) {
        this.state = 'half_open';
        this.successesWhileHalfOpen = 0;
        return true;
      }
      return false;
    }

    // half_open
    return true;
  }

  onSuccess(): void {
    if (this.state === 'half_open') {
      const successReset = Math.max(1, this.options.successReset ?? 1);
      this.successesWhileHalfOpen += 1;
      if (this.successesWhileHalfOpen >= successReset) {
        this.reset();
      }
      return;
    }

    this.reset();
  }

  onFailure(): void {
    const threshold = Math.max(1, this.options.failureThreshold ?? 3);
    this.failures += 1;
    if (this.failures >= threshold) {
      this.state = 'open';
      this.lastOpenedAt = Date.now();
    }
  }

  private reset(): void {
    this.state = 'closed';
    this.failures = 0;
    this.successesWhileHalfOpen = 0;
  }
}
