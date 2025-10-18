import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import type { ReadableStream as NodeReadableStream } from 'stream/web';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fetch } from 'undici';
import {
  collectDefaultMetrics,
  Counter,
  Gauge,
  Histogram,
  Registry,
} from 'prom-client';
import { buildUpstreamHeaders, exposeEthicsHeaders } from './http/headerForward.js';
import { assertAllowed } from './security/ssrf.js';

type VerdictColor = 'green' | 'yellow' | 'red';

interface EthicsResponseBody {
  ok?: boolean;
  verdict?: VerdictColor;
  reason?: string;
  neededEvidence?: string[];
}

interface JsonSuccess<T> {
  ok: true;
  status: number;
  data: T;
}

interface JsonFailure {
  ok: false;
  status: number | null;
  error: string;
}

type JsonResult<T> = JsonSuccess<T> | JsonFailure;

const app = express();
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: false }));

const registry = new Registry();
collectDefaultMetrics({ register: registry });

const inflightGauge = new Gauge({
  name: 'verify_gate_inflight',
  help: 'Number of in-flight verify-gate proxy requests',
  registers: [registry],
});

const upstreamDuration = new Histogram({
  name: 'verify_gate_upstream_duration_ms',
  help: 'Duration of upstream proxy calls in milliseconds',
  buckets: [25, 50, 100, 250, 500, 1000, 2000, 5000],
  registers: [registry],
});

const httpResponses = new Counter({
  name: 'verify_gate_http_responses_total',
  help: 'Count of HTTP responses by status code family',
  labelNames: ['code'],
  registers: [registry],
});

function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const existing = req.get('x-request-id');
  const id = existing && existing.toString().length > 0 ? existing.toString() : randomUUID();
  const mutableHeaders = req.headers as Record<string, unknown>;
  if (!mutableHeaders['x-request-id']) {
    mutableHeaders['x-request-id'] = id;
  }
  (req as Request & { id?: string }).id = id;
  res.locals.requestId = id;
  res.setHeader('x-request-id', id);
  next();
}

app.use((req, res, next) => {
  inflightGauge.inc();
  let decremented = false;
  const decrement = () => {
    if (!decremented) {
      inflightGauge.dec();
      decremented = true;
    }
  };
  res.on('finish', () => {
    httpResponses.inc({ code: `${Math.trunc(res.statusCode / 100)}xx` });
    decrement();
  });
  res.on('close', decrement);
  next();
});

app.use(requestIdMiddleware);

const jsonLimit = process.env.VERIFY_GATE_JSON_LIMIT ?? '128kb';
app.use(express.json({ limit: jsonLimit }));

const limiter = rateLimit({
  windowMs: 60_000,
  limit: Number(process.env.VERIFY_GATE_RPS ?? '60'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    typeof req.headers.authorization === 'string' ? `tok:${req.headers.authorization}` : `ip:${req.ip}`,
});
app.use(limiter);

app.use((_, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

const offset = Number.parseInt(process.env.PORT_OFFSET ?? '0', 10) || 0;
const defaultPort = 3111 + offset;
const configuredPort = Number.parseInt(process.env.VERIFY_PORT ?? '', 10);
const port = Number.isFinite(configuredPort) ? configuredPort + offset : defaultPort;
const host = process.env.VERIFY_HOST ?? '127.0.0.1';

const ethicsPort = Number.parseInt(process.env.ETHICS_PORT ?? '', 10);
const defaultEthicsPort = Number.isFinite(ethicsPort) ? ethicsPort + offset : 3110 + offset;
const ethicsBase = (process.env.VERIFY_ETHICS_URL ?? `http://127.0.0.1:${defaultEthicsPort}`).replace(/\/+$/, '');
const upstreamBase = (process.env.VERIFY_UPSTREAM_URL ?? `http://127.0.0.1:${4000 + offset}`).replace(/\/+$/, '');

function forwardPath(originalUrl: string): string {
  const stripped = originalUrl.replace(/^\/gate/, '') || '/';
  return stripped.startsWith('/') ? stripped : `/${stripped}`;
}

async function postJson<T>(url: string, body: unknown, headers: Record<string, string>): Promise<JsonResult<T>> {
  const controller = new AbortController();
  const timeoutMs = Number.parseInt(process.env.VERIFY_GATE_TIMEOUT_MS ?? '2000', 10);
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body ?? {}),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { ok: false, status: response.status, error: `HTTP_${response.status}` };
    }

    const data = (await response.json()) as T;
    return { ok: true, status: response.status, data };
  } catch (error) {
    const reason = error instanceof Error ? (error.name === 'AbortError' ? 'TIMEOUT' : error.message) : 'NETWORK_ERROR';
    return { ok: false, status: null, error: reason ?? 'NETWORK_ERROR' };
  } finally {
    clearTimeout(timeout);
  }
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'verify-gate', ts: new Date().toISOString() });
});

app.get('/metrics', async (_req: Request, res: Response) => {
  res.setHeader('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

app.post('/gate/*', async (req: Request, res: Response) => {
  const requestId = typeof res.locals.requestId === 'string' ? res.locals.requestId : randomUUID();
  res.locals.requestId = requestId;

  const ethicsUrl = `${ethicsBase}/ethics/check`;
  const verdictResult = await postJson<EthicsResponseBody>(
    ethicsUrl,
    {
      intent: req.originalUrl.replace(/^\/gate\//, ''),
      content: req.body,
      context: req.body?.context,
    },
    { 'x-request-id': requestId },
  );

  if (!verdictResult.ok) {
    const statusCode = verdictResult.status ?? 503;
    res.setHeader('x-ethics-verdict', 'red');
    res.setHeader('x-ethics-evidence-count', '0');
    exposeEthicsHeaders(res);
    return res.status(statusCode >= 400 ? statusCode : 503).json({
      ok: false,
      verdict: 'red',
      reason: 'ethics_unreachable',
      neededEvidence: ['Ethics check unavailable'],
    });
  }

  const verdictBody = verdictResult.data;
  const verdict = verdictBody?.verdict ?? 'red';

  const evidenceCount = Array.isArray(verdictBody?.neededEvidence) ? verdictBody.neededEvidence.length : 0;
  res.setHeader('x-ethics-verdict', verdict);
  res.setHeader('x-ethics-evidence-count', String(evidenceCount));
  exposeEthicsHeaders(res);

  if (verdict !== 'green') {
    return res.status(428).json({
      ok: false,
      verdict,
      reason: verdictBody?.reason ?? 'verification_failed',
      neededEvidence: verdictBody?.neededEvidence ?? ['weitere Evidenz erforderlich'],
    });
  }

  const path = forwardPath(req.originalUrl);
  let target: URL;
  try {
    target = new URL(path, `${upstreamBase}/`);
  } catch {
    return res.status(400).json({ ok: false, error: 'INVALID_TARGET_URL' });
  }

  try {
    await assertAllowed(target.toString());
  } catch (error) {
    return res.status(403).json({ ok: false, error: (error as Error).message ?? 'TARGET_NOT_ALLOWED' });
  }

  const body = req.body !== undefined && req.body !== null ? JSON.stringify(req.body) : undefined;
  const headers = buildUpstreamHeaders(req);
  const controller = new AbortController();
  const stopTimer = upstreamDuration.startTimer();
  req.on('close', () => controller.abort());

  try {
    const upstreamResponse = await fetch(target.toString(), {
      method: req.method,
      headers,
      body,
      signal: controller.signal,
    });

    stopTimer();

    const headerIterator = upstreamResponse.headers[Symbol.iterator]?.bind(upstreamResponse.headers);
    if (typeof (upstreamResponse.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie === 'function') {
      const cookies = (upstreamResponse.headers as unknown as { getSetCookie: () => string[] }).getSetCookie();
      if (cookies.length > 0) {
        res.setHeader('set-cookie', cookies);
      }
    }

    const applyHeader = (key: string, value: string) => {
      const lower = key.toLowerCase();
      if (lower === 'content-length' || lower === 'set-cookie') {
        return;
      }
      res.setHeader(key, value);
    };

    if (headerIterator) {
      for (const [key, value] of headerIterator() as Iterable<[string, string]>) {
        applyHeader(key, value);
      }
    } else {
      upstreamResponse.headers.forEach((value, key) => {
        applyHeader(key, value);
      });
    }

    res.status(upstreamResponse.status);

    const upstreamBody = upstreamResponse.body;
    if (!upstreamBody) {
      res.end();
      return;
    }

    const stream = Readable.fromWeb(upstreamBody as unknown as NodeReadableStream);
    stream.on('error', (error) => {
      res.destroy(error instanceof Error ? error : new Error(String(error)));
    });
    stream.pipe(res);
  } catch (error) {
    stopTimer();
    console.error('[verify-gate] upstream call failed', target.toString(), error);
    res.status(502).json({ ok: false, error: 'upstream_failed', detail: String((error as Error).message ?? error) });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, host, () => {
    console.log(`[verify-gate] listening on http://${host}:${port} (upstream ${upstreamBase})`);
  });
}

export { app };
