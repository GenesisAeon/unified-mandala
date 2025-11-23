/**
 * RetryPolicy - Configurable retry strategies with exponential backoff
 *
 * Provides resilient execution patterns for agent operations with:
 * - Exponential backoff with jitter to prevent thundering herd
 * - Configurable retry attempts and backoff parameters
 * - Integration with circuit breaker patterns
 * - Detailed error tracking and metrics
 *
 * @example
 * ```typescript
 * const policy = RetryPolicy.exponential({
 *   maxRetries: 3,
 *   initialBackoffMs: 100,
 *   maxBackoffMs: 5000,
 *   backoffMultiplier: 2,
 *   jitter: true
 * });
 *
 * const result = await policy.execute(async () => {
 *   return await riskyOperation();
 * });
 * ```
 */

export interface RetryPolicyConfig {
  /** Maximum number of retry attempts (0 = no retries, just one attempt) */
  maxRetries: number;

  /** Initial backoff delay in milliseconds */
  initialBackoffMs: number;

  /** Maximum backoff delay in milliseconds */
  maxBackoffMs: number;

  /** Multiplier for exponential backoff (e.g., 2 for doubling) */
  backoffMultiplier: number;

  /** Add jitter to prevent thundering herd (recommended: true) */
  jitter?: boolean;

  /** Predicate to determine if error is retryable (default: all errors retryable) */
  isRetryable?: (error: Error) => boolean;

  /** Callback invoked on each retry attempt */
  onRetry?: (attempt: number, error: Error, nextBackoffMs: number) => void;
}

export interface RetryResult<T> {
  /** The successful result */
  value?: T;

  /** The final error if all retries failed */
  error?: Error;

  /** Total number of attempts made */
  attempts: number;

  /** Total time spent including backoffs (ms) */
  totalDurationMs: number;

  /** Whether the operation succeeded */
  success: boolean;
}

export class RetryPolicy {
  private config: Required<RetryPolicyConfig>;

  constructor(config: RetryPolicyConfig) {
    this.config = {
      ...config,
      jitter: config.jitter ?? true,
      isRetryable: config.isRetryable ?? (() => true),
      onRetry: config.onRetry ?? (() => {}),
    };
  }

  /**
   * Factory method for exponential backoff strategy
   */
  static exponential(config: Partial<RetryPolicyConfig> = {}): RetryPolicy {
    return new RetryPolicy({
      maxRetries: 3,
      initialBackoffMs: 100,
      maxBackoffMs: 5000,
      backoffMultiplier: 2,
      jitter: true,
      ...config,
    });
  }

  /**
   * Factory method for linear backoff strategy
   */
  static linear(config: Partial<RetryPolicyConfig> = {}): RetryPolicy {
    return new RetryPolicy({
      maxRetries: 3,
      initialBackoffMs: 1000,
      maxBackoffMs: 5000,
      backoffMultiplier: 1,
      jitter: false,
      ...config,
    });
  }

  /**
   * Factory method for immediate retry (no backoff)
   */
  static immediate(maxRetries: number = 3): RetryPolicy {
    return new RetryPolicy({
      maxRetries,
      initialBackoffMs: 0,
      maxBackoffMs: 0,
      backoffMultiplier: 1,
      jitter: false,
    });
  }

  /**
   * Execute a function with retry logic
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const result = await this.executeWithResult(fn);
    if (result.success && result.value !== undefined) {
      return result.value;
    }
    throw result.error || new Error('Retry exhausted without specific error');
  }

  /**
   * Execute with detailed result information
   */
  async executeWithResult<T>(fn: () => Promise<T>): Promise<RetryResult<T>> {
    const startTime = Date.now();
    let lastError: Error | undefined;
    let attempt = 0;

    for (attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const value = await fn();
        return {
          value,
          success: true,
          attempts: attempt + 1,
          totalDurationMs: Date.now() - startTime,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Check if error is retryable
        if (!this.config.isRetryable(lastError)) {
          return {
            error: lastError,
            success: false,
            attempts: attempt + 1,
            totalDurationMs: Date.now() - startTime,
          };
        }

        // If this was the last attempt, don't wait
        if (attempt === this.config.maxRetries) {
          break;
        }

        // Calculate backoff and wait
        const backoffMs = this.calculateBackoff(attempt);
        this.config.onRetry(attempt + 1, lastError, backoffMs);

        if (backoffMs > 0) {
          await this.sleep(backoffMs);
        }
      }
    }

    return {
      error: lastError,
      success: false,
      attempts: attempt + 1,
      totalDurationMs: Date.now() - startTime,
    };
  }

  /**
   * Calculate backoff delay for a given attempt
   */
  private calculateBackoff(attempt: number): number {
    // Calculate exponential backoff
    const exponentialBackoff =
      this.config.initialBackoffMs *
      Math.pow(this.config.backoffMultiplier, attempt);

    // Cap at maximum
    let backoff = Math.min(exponentialBackoff, this.config.maxBackoffMs);

    // Add jitter if enabled (random value between 0 and backoff)
    if (this.config.jitter && backoff > 0) {
      backoff = Math.random() * backoff;
    }

    return Math.floor(backoff);
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<RetryPolicyConfig> {
    return { ...this.config };
  }
}

/**
 * Helper function for simple retry with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config?: Partial<RetryPolicyConfig>,
): Promise<T> {
  const policy = RetryPolicy.exponential(config);
  return policy.execute(fn);
}

/**
 * Decorator for adding retry logic to class methods
 */
export function Retryable(config?: Partial<RetryPolicyConfig>) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const policy = RetryPolicy.exponential(config);

    descriptor.value = async function (...args: any[]) {
      return policy.execute(() => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}
