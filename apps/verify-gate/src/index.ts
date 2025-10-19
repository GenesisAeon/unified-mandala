import { createHash, randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import type { ReadableStream as NodeReadableStream } from 'stream/web';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fetch } from 'undici';
import { buildUpstreamHeaders, exposeEthicsHeaders } from './http/headerForward.js';
import { assertAllowed, hasAllowlistEntries } from './security/ssrf.js';
import { makePinnedAgent } from './security/agent.js';
import { bodySha256, verdictFingerprint } from './security/fingerprint.js';
import { RateLimiter } from './security/rateLimiter.js';
import { JtiStore } from './idempotency/jtiStore.js';
import { db, forget, makeKey, rememberFinal, rememberPending, seen } from './idempotency/index.js';
import { scheduleGc } from './idempotency/scheduler.js';
import { signVerdict } from './verdictToken.js';
import {
  httpResponses,
  idemHits,
  inflightGauge,
  registry,
  startUpstreamTimer,
  tokenFails,
  rateLimitBlocks,
} from './metrics.js';

type VerdictColor = 'green' | 'yellow' | 'red';

interface EthicsResponseBody {
  ok?: boolean;
  verdict?: VerdictColor;
  reason?: string;
  neededEvidence?: string[];
  grounding?: { citations?: Array<Record<string, unknown>> };
  boundary?: { violations?: Array<Record<string, unknown>> };
  evidence?: { domains?: string[]; strong?: number };
  deps?: Record<string, unknown>;
}

interface JsonMeta {
  degraded?: string | null;
}

interface JsonSuccess<T> {
  ok: true;
  status: number;
  data: T;
  meta: JsonMeta;
}

interface JsonFailure {
  ok: false;
  status: number | null;
  error: string;
  meta: JsonMeta;
}

type JsonResult<T> = JsonSuccess<T> | JsonFailure;

const tokenTtlSeconds = Math.max(Number.parseInt(process.env.VERIFY_GATE_TOKEN_TTL_SEC ?? '60', 10), 5);
const rateLimitRpm = Number.parseInt(process.env.VERIFY_GATE_RATE_RPM ?? '0', 10);

const jtiStore = new JtiStore(db);
scheduleGc(() => jtiStore.purge(), Number(process.env.VERIFY_GATE_GC_MS ?? process.env.VERIFY_GATE_IDEMP_TTL_MS ?? '60000'));

const rateLimiter = rateLimitRpm > 0 ? new RateLimiter(db, rateLimitRpm) : null;

function deriveSubject(req: Request): string {
  const auth = typeof req.headers.authorization === 'string' ? req.headers.authorization : undefined;
  if (auth) {
    return `auth:${createHash('sha1').update(auth).digest('hex')}`;
  }
  const cookie = typeof req.headers.cookie === 'string' ? req.headers.cookie : undefined;
  if (cookie) {
    return `cookie:${createHash('sha1').update(cookie).digest('hex')}`;
  }
  return `ip:${req.ip}`;
}

function evidenceDomainsFrom(verdictBody: EthicsResponseBody): { domains: string[]; strongCount: number } {
  const domains: string[] = [];
  let strongCount = 0;
  const citations = Array.isArray(verdictBody?.grounding?.citations)
    ? (verdictBody.grounding.citations as Array<Record<string, unknown>>)
    : [];
  for (const citation of citations) {
    const domainRaw = typeof citation.domain === 'string' ? citation.domain : undefined;
    const uri = typeof citation.uri === 'string' ? citation.uri : undefined;
    let domain = domainRaw;
    if (!domain && uri) {
      try {
        domain = new URL(uri).hostname.replace(/^www\./, '');
      } catch {}
    }
    if (domain) {
      const normalized = domain.toLowerCase();
      if (!domains.includes(normalized)) {
        domains.push(normalized);
      }
    }
    const strength = typeof citation.strength === 'string' ? citation.strength.toLowerCase() : undefined;
    if (strength === 'strong') {
      strongCount += 1;
    }
  }
  const explicit = Array.isArray(verdictBody?.evidence?.domains)
    ? (verdictBody.evidence?.domains as string[])
    : [];
  for (const domain of explicit) {
    if (typeof domain === 'string') {
      const normalized = domain.toLowerCase();
      if (!domains.includes(normalized)) {
        domains.push(normalized);
      }
    }
  }
  if (typeof verdictBody?.evidence?.strong === 'number') {
    strongCount = Math.max(strongCount, verdictBody.evidence.strong);
  }
  return { domains, strongCount };
}

function boundaryHitsFrom(verdictBody: EthicsResponseBody): string[] {
  const violations = Array.isArray(verdictBody?.boundary?.violations)
    ? (verdictBody.boundary?.violations as Array<Record<string, unknown>>)
    : [];
  const hits: string[] = [];
  for (const violation of violations) {
    const rule = typeof violation.ruleId === 'string' ? violation.ruleId : typeof violation.rule === 'string' ? violation.rule : 'unknown';
    const severity = typeof violation.severity === 'string' ? violation.severity : 'unknown';
    hits.push(`${rule}:${severity}`);
  }
  return hits;
}

const app = express();
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: false }));

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

function sha1(value: string): string {
  const hash = createHash('sha1');
  hash.update(value);
  return hash.digest('hex');
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

    const degraded = response.headers.get('x-ethics-degraded');
    if (!response.ok) {
      return { ok: false, status: response.status, error: `HTTP_${response.status}`, meta: { degraded } };
    }

    const data = (await response.json()) as T;
    return { ok: true, status: response.status, data, meta: { degraded } };
  } catch (error) {
    const reason = error instanceof Error ? (error.name === 'AbortError' ? 'TIMEOUT' : error.message) : 'NETWORK_ERROR';
    return { ok: false, status: null, error: reason ?? 'NETWORK_ERROR', meta: { degraded: undefined } };
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

app.get('/readyz', async (_req: Request, res: Response) => {
  if (!hasAllowlistEntries()) {
    return res.status(503).json({ ok: false, reason: 'allowlist_unset' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1000);
  try {
    const response = await fetch(`${ethicsBase}/readyz`, { signal: controller.signal });
    if (!response.ok) {
      return res.status(503).json({ ok: false, reason: 'ethics_unavailable', status: response.status });
    }
    const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    return res.json({ ok: true, ethics: payload });
  } catch (error) {
    return res.status(503).json({ ok: false, reason: 'ethics_check_failed', detail: String((error as Error).message ?? error) });
  } finally {
    clearTimeout(timeout);
  }
});

app.post('/gate/*', async (req: Request, res: Response) => {
  const requestId = typeof res.locals.requestId === 'string' ? res.locals.requestId : randomUUID();
  res.locals.requestId = requestId;

  const path = forwardPath(req.originalUrl);
  let target: URL;
  try {
    target = new URL(path, `${upstreamBase}/`);
  } catch {
    return res.status(400).json({ ok: false, error: 'INVALID_TARGET_URL' });
  }

  const targetUrl = target.toString();
  const routeKey = target.pathname || '/';
  const pathHash = sha1(`${(req.method ?? 'GET').toUpperCase()}:${target.pathname}`);
  const headerSignature = typeof req.headers.authorization === 'string' ? req.headers.authorization : '';
  const incomingIdempotencyKey = typeof req.headers['idempotency-key'] === 'string' ? req.headers['idempotency-key'] : undefined;
  const idemKey = incomingIdempotencyKey ?? makeKey(req.method ?? 'GET', targetUrl, req.body, headerSignature);
  const subject = deriveSubject(req);
  const prior = seen(idemKey);
  if (prior) {
    idemHits.inc();
    const reuseRequestId = prior.requestId ?? requestId;
    res.setHeader('x-request-id', reuseRequestId);
    if (prior.verdict) {
      res.setHeader('x-ethics-verdict', prior.verdict);
    }
    if (typeof prior.evidenceCount === 'number') {
      res.setHeader('x-ethics-evidence-count', String(prior.evidenceCount));
    }
    exposeEthicsHeaders(res);
    return res.status(409).json({ ok: false, reason: 'duplicate', requestId: reuseRequestId });
  }

  if (rateLimiter) {
    const decision = rateLimiter.take(subject);
    if (!decision.allowed) {
      rateLimitBlocks.inc({ scope: 'subject' });
      return res.status(429).json({ ok: false, error: 'rate_limited', scope: 'subject' });
    }
  }

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

  let degradedHeaderValue: string | null = null;
  if (typeof verdictResult.meta?.degraded === 'string') {
    const degradedValue = verdictResult.meta.degraded.trim();
    degradedHeaderValue = degradedValue.length > 0 ? degradedValue : '1';
    res.setHeader('x-verify-degraded', degradedHeaderValue);
  }

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

  let allowResult: Awaited<ReturnType<typeof assertAllowed>> | null = null;
  try {
    allowResult = await assertAllowed(targetUrl);
  } catch (error) {
    return res.status(403).json({ ok: false, error: (error as Error).message ?? 'TARGET_NOT_ALLOWED' });
  }

  if (!allowResult) {
    return res.status(403).json({ ok: false, error: 'TARGET_NOT_ALLOWED' });
  }

  const bodyHash = bodySha256(req.body);
  const body = req.body !== undefined && req.body !== null ? JSON.stringify(req.body) : undefined;
  const headers = buildUpstreamHeaders(req, target.host);
  if (degradedHeaderValue) {
    headers.set('x-verify-degraded', degradedHeaderValue);
  }
  const { domains: evidenceDomains } = evidenceDomainsFrom(verdictBody);
  const boundaryHits = boundaryHitsFrom(verdictBody);
  const fingerprint = verdictFingerprint({
    reqId: requestId,
    method: req.method ?? 'GET',
    path: routeKey,
    bodyHash,
    evidenceDomains,
    boundaryHits,
  });
  const jti = createHash('sha256').update(`${subject}|${bodyHash}|${routeKey}`).digest('hex');
  const degradedActive = Boolean(degradedHeaderValue);

  try {
    const { token: verdictToken, claims } = signVerdict({
      subject,
      audience: routeKey,
      verdict,
      evidenceCount,
      requestId,
      pathHash,
      fingerprint,
      contentHash: bodyHash,
      evidenceDomains,
      boundaryHits,
      degraded: degradedActive,
      ttlSeconds: tokenTtlSeconds,
      jti,
    });
    if (jtiStore.seen(claims.jti, claims.exp)) {
      rateLimitBlocks.inc({ scope: 'jti' });
      return res.status(409).json({ ok: false, reason: 'jwt_replay', requestId });
    }
    headers.set('x-ethics-token', verdictToken);
  } catch (error) {
    tokenFails.inc({ reason: 'sign_error' });
    console.error('[verify-gate] failed to sign verdict token', error);
    return res.status(500).json({ ok: false, error: 'verdict_token_sign_failed' });
  }
  const controller = new AbortController();
  const stopTimer = startUpstreamTimer(req.method ?? 'GET', routeKey);
  req.on('close', () => controller.abort());

  try {
    rememberPending(idemKey, requestId);
    const agent = await makePinnedAgent(targetUrl, allowResult.ip);
    const upstreamResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      dispatcher: agent,
      signal: controller.signal,
    });

    stopTimer(String(upstreamResponse.status));

    const metricClone = typeof upstreamResponse.clone === 'function' ? upstreamResponse.clone() : null;
    if (upstreamResponse.status === 428 || upstreamResponse.status === 401) {
      let reason = upstreamResponse.status === 401 ? 'upstream_401' : 'upstream_428';
      const contentType = metricClone?.headers.get('content-type') ?? '';
      if (metricClone && /application\/json/i.test(contentType)) {
        try {
          const payload = (await metricClone.json()) as { reason?: unknown };
          if (typeof payload?.reason === 'string' && payload.reason.length > 0) {
            reason = payload.reason;
          }
        } catch {}
      }
      tokenFails.inc({ reason });
    }

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
      rememberFinal(idemKey, upstreamResponse.status, requestId, verdict, evidenceCount);
      res.end();
      return;
    }

    const stream = Readable.fromWeb(upstreamBody as unknown as NodeReadableStream);
    stream.on('error', (error) => {
      forget(idemKey);
      res.destroy(error instanceof Error ? error : new Error(String(error)));
    });
    stream.on('end', () => {
      rememberFinal(idemKey, upstreamResponse.status, requestId, verdict, evidenceCount);
    });
    stream.on('close', () => {
      rememberFinal(idemKey, upstreamResponse.status, requestId, verdict, evidenceCount);
    });
    stream.pipe(res);
  } catch (error) {
    stopTimer('error');
    console.error('[verify-gate] upstream call failed', target.toString(), error);
    forget(idemKey);
    res.status(502).json({ ok: false, error: 'upstream_failed', detail: String((error as Error).message ?? error) });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, host, () => {
    console.log(`[verify-gate] listening on http://${host}:${port} (upstream ${upstreamBase})`);
  });
}

export { app };
