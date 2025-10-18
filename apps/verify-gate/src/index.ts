import { randomUUID } from 'node:crypto';
import type { IncomingHttpHeaders } from 'node:http';
import express, { type Request, type Response } from 'express';
import { fetch } from 'undici';

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
app.use(express.json({ limit: '1mb' }));

const offset = Number.parseInt(process.env.PORT_OFFSET ?? '0', 10) || 0;
const defaultPort = 3111 + offset;
const configuredPort = Number.parseInt(process.env.VERIFY_PORT ?? '', 10);
const port = Number.isFinite(configuredPort) ? configuredPort + offset : defaultPort;
const host = process.env.VERIFY_HOST ?? '127.0.0.1';

const ethicsPort = Number.parseInt(process.env.ETHICS_PORT ?? '', 10);
const defaultEthicsPort = Number.isFinite(ethicsPort) ? ethicsPort + offset : 3110 + offset;
const ethicsBase = (process.env.VERIFY_ETHICS_URL ?? `http://127.0.0.1:${defaultEthicsPort}`).replace(/\/+$/, '');
const upstreamBase = (process.env.VERIFY_UPSTREAM_URL ?? `http://127.0.0.1:${4000 + offset}`).replace(/\/+$/, '');

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
]);

function forwardPath(originalUrl: string): string {
  const stripped = originalUrl.replace(/^\/gate/, '') || '/';
  return stripped.startsWith('/') ? stripped : `/${stripped}`;
}

async function postJson<T>(url: string, body: unknown): Promise<JsonResult<T>> {
  const controller = new AbortController();
  const timeoutMs = Number.parseInt(process.env.VERIFY_GATE_TIMEOUT_MS ?? '2000', 10);
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
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

function buildProxyHeaders(req: Request, hasBody: boolean): Record<string, string> {
  const incoming = (req.headers ?? {}) as IncomingHttpHeaders;
  const outgoing: Record<string, string> = {};

  for (const [key, value] of Object.entries(incoming)) {
    if (value === undefined || value === null) {
      continue;
    }
    const lower = key.toLowerCase();
    if (HOP_BY_HOP.has(lower)) {
      continue;
    }
    outgoing[lower] = Array.isArray(value) ? value.join(',') : String(value);
  }

  if (hasBody && !('content-type' in outgoing)) {
    outgoing['content-type'] = 'application/json';
  }

  const forwardedFor = [incoming['x-forwarded-for'], req.ip].filter(Boolean).join(', ');
  if (forwardedFor) {
    outgoing['x-forwarded-for'] = forwardedFor;
  }

  if (!('x-forwarded-proto' in outgoing)) {
    outgoing['x-forwarded-proto'] = req.secure ? 'https' : req.protocol ?? 'http';
  }

  const hostHeader = req.get('host');
  if (hostHeader && !('x-forwarded-host' in outgoing)) {
    outgoing['x-forwarded-host'] = hostHeader;
  }

  if (!('x-request-id' in outgoing)) {
    outgoing['x-request-id'] = req.get('x-request-id') ?? randomUUID();
  }

  return outgoing;
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'verify-gate', ts: new Date().toISOString() });
});

app.post('/gate/*', async (req: Request, res: Response) => {
  const ethicsUrl = `${ethicsBase}/ethics/check`;
  const verdictResult = await postJson<EthicsResponseBody>(ethicsUrl, {
    intent: req.originalUrl.replace(/^\/gate\//, ''),
    content: req.body,
    context: req.body?.context,
  });

  if (!verdictResult.ok) {
    const statusCode = verdictResult.status ?? 503;
    return res.status(statusCode >= 400 ? statusCode : 503).json({
      ok: false,
      verdict: 'red',
      reason: 'ethics_unreachable',
      neededEvidence: ['Ethics check unavailable'],
    });
  }

  const verdictBody = verdictResult.data;

  const verdict = verdictBody?.verdict ?? 'red';
  if (verdict !== 'green') {
    return res.status(428).json({
      ok: false,
      verdict,
      reason: verdictBody?.reason ?? 'verification_failed',
      neededEvidence: verdictBody?.neededEvidence ?? ['weitere Evidenz erforderlich'],
    });
  }

  const path = forwardPath(req.originalUrl);
  const targetUrl = `${upstreamBase}${path}`;

  try {
    const body = req.body !== undefined && req.body !== null ? JSON.stringify(req.body) : undefined;
    const hasBody = body !== undefined;
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: buildProxyHeaders(req, hasBody),
      body,
    });

    const headerIterator = response.headers[Symbol.iterator]?.bind(response.headers);
    if (typeof (response.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie === 'function') {
      const cookies = (response.headers as unknown as { getSetCookie: () => string[] }).getSetCookie();
      if (cookies.length > 0) {
        res.setHeader('set-cookie', cookies);
      }
    }
    if (headerIterator) {
      for (const [key, value] of headerIterator() as Iterable<[string, string]>) {
        if (HOP_BY_HOP.has(key.toLowerCase()) || key.toLowerCase() === 'set-cookie') {
          continue;
        }
        res.setHeader(key, value);
      }
    } else {
      response.headers.forEach((value, key) => {
        const lower = key.toLowerCase();
        if (HOP_BY_HOP.has(lower) || lower === 'set-cookie') {
          return;
        }
        res.setHeader(key, value);
      });
    }

    const evidenceCount = Array.isArray(verdictBody?.neededEvidence) ? verdictBody.neededEvidence.length : 0;
    res.setHeader('x-ethics-verdict', verdict);
    res.setHeader('x-ethics-evidence-count', String(evidenceCount));

    const payload = Buffer.from(await response.arrayBuffer());
    res.status(response.status).send(payload);
  } catch (error) {
    console.error('[verify-gate] upstream call failed', targetUrl, error);
    res.status(502).json({ ok: false, error: 'upstream_failed', detail: String((error as Error).message ?? error) });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, host, () => {
    console.log(`[verify-gate] listening on http://${host}:${port} (upstream ${upstreamBase})`);
  });
}

export { app };
