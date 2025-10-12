import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'node:events';

const OLD_ENV = { ...process.env } as NodeJS.ProcessEnv;

describe('middleware/request-logger', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV } as any;
    vi.resetModules();
  });
  afterEach(() => {
    process.env = OLD_ENV;
    (Math.random as any).mockRestore?.();
  });

  it('wraps next() with context when sampling allows', async () => {
    process.env.LOG_CONTEXT_SAMPLE = '1';
    delete process.env.LOG_CONTEXT;
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const ctxSpy = vi.fn((ctx: any, fn: any) => fn());
    const infoSpy = vi.fn();
    vi.doMock('../../packages/logging/context', () => ({ runWithCtx: ctxSpy }));
    vi.doMock('../../packages/logging/logger', () => ({
      logWithContext: () => ({ info: infoSpy }),
    }));

    const { requestLogger } = await import('../../src/middleware/request-logger');

    const req = new EventEmitter() as any;
    req.method = 'GET';
    req.url = '/x';
    req.headers = {};

    const res = new EventEmitter() as any;
    res.statusCode = 200;

    const next = vi.fn();
    requestLogger(req, res, next);
    expect(next).toHaveBeenCalled();
    // simulate response finishing
    res.emit('finish');
    expect(infoSpy).toHaveBeenCalled();
    expect(ctxSpy).toHaveBeenCalled();
  });

  it('does not run context when LOG_CONTEXT=off', async () => {
    process.env.LOG_CONTEXT = 'off';
    process.env.LOG_CONTEXT_SAMPLE = '1';
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const ctxSpy = vi.fn((ctx: any, fn: any) => fn());
    const infoSpy = vi.fn();
    vi.doMock('../../packages/logging/context', () => ({ runWithCtx: ctxSpy }));
    vi.doMock('../../packages/logging/logger', () => ({
      logWithContext: () => ({ info: infoSpy }),
    }));

    const { requestLogger } = await import('../../src/middleware/request-logger');

    const req = new EventEmitter() as any;
    req.method = 'GET';
    req.url = '/y';
    req.headers = {};
    const res = new EventEmitter() as any;
    res.statusCode = 201;
    const next = vi.fn();
    requestLogger(req, res, next);
    res.emit('finish');
    expect(infoSpy).toHaveBeenCalled();
    expect(ctxSpy).not.toHaveBeenCalled();
  });
});
