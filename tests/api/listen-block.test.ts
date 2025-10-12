import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock express to intercept app.listen without opening a port
vi.mock('express', () => {
  const app = {
    use: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    listen: vi.fn((_port: number, cb?: () => void) => {
      cb && cb();
      return { close: vi.fn() } as any;
    }),
  };
  return { default: () => app } as any;
});

vi.mock('cors', () => ({ default: () => (_req: any, _res: any, next: any) => next?.() }));

// zod, askOpenAI, ports can be real or minimally mocked
vi.mock('@unified-mandala/ai', () => ({ askOpenAI: vi.fn() }));
vi.mock('@config/ports', () => ({ default: { ai: 3999 } }));

describe('API listen block executes when not test', () => {
  let mod: any;
  beforeEach(async () => {
    vi.resetModules();
    delete process.env.VITEST; // simulate non-vitest
    process.env.NODE_ENV = 'production';
    // Ensure app instance injection happens before API import
    const express = await import('express');
    const app: any = (express as any).default();
    (globalThis as any).__UM_TEST_EXPRESS_APP = app;
    mod = await import('../../apps/api/src/index');
  });
  afterEach(() => {
    process.env.VITEST = '1';
    vi.restoreAllMocks();
  });

  it('calls app.listen with configured port', async () => {
    const express = await import('express');
    const app: any = (express as any).default();
    expect(app.listen).toHaveBeenCalledTimes(1);
    expect(app.listen.mock.calls[0][0]).toBe(3999);
  });
});
