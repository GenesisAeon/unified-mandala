import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RetryPolicy, withRetry, Retryable } from '../RetryPolicy';

describe('RetryPolicy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Factory Methods', () => {
    it('should create exponential backoff policy', () => {
      const policy = RetryPolicy.exponential();
      const config = policy.getConfig();

      expect(config.maxRetries).toBe(3);
      expect(config.initialBackoffMs).toBe(100);
      expect(config.maxBackoffMs).toBe(5000);
      expect(config.backoffMultiplier).toBe(2);
      expect(config.jitter).toBe(true);
    });

    it('should create linear backoff policy', () => {
      const policy = RetryPolicy.linear();
      const config = policy.getConfig();

      expect(config.backoffMultiplier).toBe(1);
      expect(config.jitter).toBe(false);
    });

    it('should create immediate retry policy', () => {
      const policy = RetryPolicy.immediate(5);
      const config = policy.getConfig();

      expect(config.maxRetries).toBe(5);
      expect(config.initialBackoffMs).toBe(0);
      expect(config.maxBackoffMs).toBe(0);
    });
  });

  describe('Successful Execution', () => {
    it('should succeed on first attempt', async () => {
      const policy = RetryPolicy.immediate(3);
      const fn = vi.fn().mockResolvedValue('success');

      const result = await policy.execute(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should succeed after retries', async () => {
      const policy = RetryPolicy.immediate(3);
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockResolvedValue('success');

      const result = await policy.execute(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });

  describe('Failed Execution', () => {
    it('should throw after max retries', async () => {
      const policy = RetryPolicy.immediate(2);
      const fn = vi.fn().mockRejectedValue(new Error('permanent failure'));

      await expect(policy.execute(fn)).rejects.toThrow('permanent failure');
      expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
    });

    it('should not retry non-retryable errors', async () => {
      const policy = new RetryPolicy({
        maxRetries: 3,
        initialBackoffMs: 0,
        maxBackoffMs: 0,
        backoffMultiplier: 1,
        isRetryable: (error) => !error.message.includes('fatal'),
      });

      const fn = vi.fn().mockRejectedValue(new Error('fatal error'));

      await expect(policy.execute(fn)).rejects.toThrow('fatal error');
      expect(fn).toHaveBeenCalledTimes(1); // No retries
    });
  });

  describe('Backoff Calculation', () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); });

    it('should apply exponential backoff', async () => {
      const onRetry = vi.fn();
      const policy = new RetryPolicy({
        maxRetries: 3,
        initialBackoffMs: 100,
        maxBackoffMs: 10000,
        backoffMultiplier: 2,
        jitter: false,
        onRetry,
      });

      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockRejectedValueOnce(new Error('fail 2'))
        .mockRejectedValueOnce(new Error('fail 3'))
        .mockResolvedValue('success');

      const p = policy.execute(fn);
      await vi.runAllTimersAsync();
      await p;

      // Check backoff values: 100, 200, 400
      expect(onRetry).toHaveBeenNthCalledWith(
        1,
        1,
        expect.any(Error),
        100,
      );
      expect(onRetry).toHaveBeenNthCalledWith(
        2,
        2,
        expect.any(Error),
        200,
      );
      expect(onRetry).toHaveBeenNthCalledWith(
        3,
        3,
        expect.any(Error),
        400,
      );
    });

    it('should cap backoff at maxBackoffMs', async () => {
      const onRetry = vi.fn();
      const policy = new RetryPolicy({
        maxRetries: 5,
        initialBackoffMs: 1000,
        maxBackoffMs: 2000,
        backoffMultiplier: 2,
        jitter: false,
        onRetry,
      });

      const fn = vi.fn().mockRejectedValue(new Error('fail'));

      const p = expect(policy.execute(fn)).rejects.toThrow();
      await vi.runAllTimersAsync();
      await p;

      // Backoff: 1000, 2000, 2000 (capped), 2000 (capped), 2000 (capped)
      const backoffs = onRetry.mock.calls.map((call) => call[2]);
      expect(backoffs).toEqual([1000, 2000, 2000, 2000, 2000]);
    });

    it('should add jitter when enabled', async () => {
      const onRetry = vi.fn();
      const policy = new RetryPolicy({
        maxRetries: 3,
        initialBackoffMs: 1000,
        maxBackoffMs: 10000,
        backoffMultiplier: 2,
        jitter: true,
        onRetry,
      });

      const fn = vi.fn().mockRejectedValue(new Error('fail'));

      const p = expect(policy.execute(fn)).rejects.toThrow();
      await vi.runAllTimersAsync();
      await p;

      // With jitter, backoffs should be randomized between 0 and calculated value
      const backoffs = onRetry.mock.calls.map((call) => call[2]);
      expect(backoffs[0]).toBeGreaterThanOrEqual(0);
      expect(backoffs[0]).toBeLessThanOrEqual(1000);
      expect(backoffs[1]).toBeGreaterThanOrEqual(0);
      expect(backoffs[1]).toBeLessThanOrEqual(2000);
    });
  });

  describe('executeWithResult', () => {
    it('should return detailed success result', async () => {
      const policy = RetryPolicy.immediate(3);
      const fn = vi.fn().mockResolvedValue('success');

      const result = await policy.executeWithResult(fn);

      expect(result.success).toBe(true);
      expect(result.value).toBe('success');
      expect(result.attempts).toBe(1);
      expect(result.totalDurationMs).toBeGreaterThanOrEqual(0);
      expect(result.error).toBeUndefined();
    });

    it('should return detailed failure result', async () => {
      const policy = RetryPolicy.immediate(2);
      const error = new Error('failure');
      const fn = vi.fn().mockRejectedValue(error);

      const result = await policy.executeWithResult(fn);

      expect(result.success).toBe(false);
      expect(result.value).toBeUndefined();
      expect(result.attempts).toBe(3); // initial + 2 retries
      expect(result.error).toBe(error);
      expect(result.totalDurationMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('withRetry Helper', () => {
    it('should retry with default exponential backoff', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');

      const result = await withRetry(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should accept custom config', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');

      const result = await withRetry(fn, {
        maxRetries: 5,
        initialBackoffMs: 50,
      });

      expect(result).toBe('success');
    });
  });

  describe('Retryable Decorator', () => {
    it('should add retry logic to method via descriptor mutation', async () => {
      let callCount = 0;
      const descriptor: PropertyDescriptor = {
        value: async () => {
          callCount++;
          if (callCount < 3) throw new Error('transient');
          return 'decorated-success';
        },
      };

      Retryable({ maxRetries: 3, initialBackoffMs: 0, maxBackoffMs: 0, backoffMultiplier: 1 })(
        {},
        'testMethod',
        descriptor,
      );

      const result = await descriptor.value();
      expect(result).toBe('decorated-success');
      expect(callCount).toBe(3);
    });

    it('should exhaust retries and propagate error', async () => {
      const descriptor: PropertyDescriptor = {
        value: async () => {
          throw new Error('permanent');
        },
      };

      Retryable({ maxRetries: 2, initialBackoffMs: 0, maxBackoffMs: 0, backoffMultiplier: 1 })(
        {},
        'testMethod',
        descriptor,
      );

      await expect(descriptor.value()).rejects.toThrow('permanent');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero retries', async () => {
      const policy = RetryPolicy.immediate(0);
      const fn = vi.fn().mockRejectedValue(new Error('fail'));

      await expect(policy.execute(fn)).rejects.toThrow('fail');
      expect(fn).toHaveBeenCalledTimes(1); // Only initial attempt
    });

    it('should handle non-Error throws', async () => {
      const policy = RetryPolicy.immediate(1);
      const fn = vi.fn().mockRejectedValue('string error');

      await expect(policy.execute(fn)).rejects.toThrow('string error');
    });

    it('should track attempts correctly across retries', async () => {
      const policy = RetryPolicy.immediate(5);
      let callCount = 0;
      const fn = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount < 4) {
          throw new Error('fail');
        }
        return 'success';
      });

      const result = await policy.executeWithResult(fn);

      expect(result.success).toBe(true);
      expect(result.attempts).toBe(4);
      expect(fn).toHaveBeenCalledTimes(4);
    });
  });

  describe('Callback Integration', () => {
    it('should invoke onRetry callback', async () => {
      const onRetry = vi.fn();
      const policy = new RetryPolicy({
        maxRetries: 2,
        initialBackoffMs: 0,
        maxBackoffMs: 0,
        backoffMultiplier: 1,
        onRetry,
      });

      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('fail 1'))
        .mockResolvedValue('success');

      await policy.execute(fn);

      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ message: 'fail 1' }),
        0,
      );
    });
  });
});
