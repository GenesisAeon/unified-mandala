import { runWithCtx } from '../../packages/logging/context';
import { logWithContext } from '../../packages/logging/logger';
import { randomUUID } from 'crypto';
import type { IncomingMessage, ServerResponse } from 'http';

const SAMPLE = Math.min(1, Math.max(0, Number(process.env.LOG_CONTEXT_SAMPLE ?? '1')));
const DISABLED = String(process.env.LOG_CONTEXT ?? '').toLowerCase() === 'off';

export function requestLogger(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const reqId = (req.headers['x-request-id'] as string) || randomUUID();
  const start = Date.now();
  const run = (fn: () => void) =>
    DISABLED || Math.random() > SAMPLE ? fn() : runWithCtx({ requestId: reqId }, fn);
  run(() => {
    const log = logWithContext();
    log.info({ method: req.method, url: req.url }, 'req:start');
    const done = () => {
      res.off('finish', done);
      res.off('close', done);
      log.info({ status: res.statusCode, ms: Date.now() - start }, 'req:end');
    };
    res.on('finish', done);
    res.on('close', done);
    next();
  });
}
