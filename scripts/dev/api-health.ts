import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import { logWithContext } from '../../packages/logging/logger';
import Redis from 'ioredis';

export async function handleHealth(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const u = new URL(req.url || '', 'http://localhost');
  if (u.pathname !== '/healthz' && u.pathname !== '/readyz') return false;
  const log = logWithContext();
  const version =
    (fs.existsSync('package.json')
      ? JSON.parse(fs.readFileSync('package.json', 'utf8')).version
      : '0.0.0') || '0.0.0';
  let ready = true;
  let redisOk: boolean | undefined;
  const url = process.env.REDIS_URL;
  if (url) {
    try {
      const r = new Redis(url, { lazyConnect: true, connectTimeout: 300 });
      await r.connect();
      await r.ping();
      await r.quit();
      redisOk = true;
    } catch {
      redisOk = false;
      ready = false;
    }
  }
  const data = {
    ok: true,
    service: 'unified-mandala',
    version,
    ts: new Date().toISOString(),
    ready,
    dependencies: { redis: redisOk },
  };
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
  log.info({ path: u.pathname }, 'health');
  return true;
}
