import { describe, it, expect, vi } from 'vitest';

// Spies for logger
const infoSpy = vi.hoisted(() => vi.fn());

vi.mock('../../../packages/logging/logger', () => ({
  logWithContext: () => ({ info: infoSpy }),
}));

vi.mock('../../../packages/logging/context', () => ({
  runWithCtx: (_ctx: any, fn: any) => fn(),
}));

type Req = { method?: string; url?: string; headers: Record<string, string> };

describe('requestLogger middleware', () => {
  it('logs start and end, and calls next', async () => {
    delete process.env.LOG_CONTEXT; // ensure not disabled
    process.env.LOG_CONTEXT_SAMPLE = '1'; // sample always
    vi.useFakeTimers();
    const mod = await import('../request-logger');
    const req: Req = { method: 'GET', url: '/x', headers: {} };
    const handlers: Record<string, () => void> = {};
    const res: any = {
      statusCode: 200,
      on: (ev: string, cb: () => void) => {
        handlers[ev] = cb;
      },
      off: () => {},
    };
    const next = vi.fn();

    mod.requestLogger(req as any, res as any, next);
    expect(next).toHaveBeenCalled();
    // Simulate a finished response
    vi.advanceTimersByTime(1);
    handlers['finish']?.();
    // Should have logged start and end
    const messages = infoSpy.mock.calls.map((c) => c[1]);
    expect(messages).toContain('req:start');
    expect(messages).toContain('req:end');
    vi.useRealTimers();
  });
});
