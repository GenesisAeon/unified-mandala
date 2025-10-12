import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EventEmitter } from 'node:events';

const OLD_ENV = { ...process.env } as NodeJS.ProcessEnv;

describe('middleware/request-logger (no mocks)', () => {
  beforeEach(() => {
    process.env = { ...OLD_ENV } as any;
  });
  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('logs start/end and calls next when LOG_CONTEXT is off', async () => {
    process.env.LOG_CONTEXT = 'off';
    const { requestLogger } = await import('../../src/middleware/request-logger');
    const req = new EventEmitter() as any;
    req.method = 'GET';
    req.url = '/z';
    req.headers = {};
    const res = new EventEmitter() as any;
    res.statusCode = 204;
    const next = vi.fn();
    requestLogger(req, res, next);
    expect(next).toHaveBeenCalled();
    // Emit finish to exercise end logging
    res.emit('finish');
  });
});
