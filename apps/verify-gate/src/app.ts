import { createHash, randomUUID } from 'node:crypto';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fetch } from 'undici';
import { Registry } from 'prom-client';
import { buildUpstreamHeaders, exposeEthicsHeaders } from './http/headerForward.js';
import { assertAllowed, hasAllowlistEntries } from './security/ssrf.js';
import { isPrivateOrBlocked, normalizeIp } from './security/ipRanges.js';
import { followRedirectsWithPreflight } from './proxy/followRedirects.js';
import { pinnedRequest } from './proxy/pinnedRequest.js';
import { bodySha256, verdictFingerprint } from './security/fingerprint.js';
import { RateLimiter } from './security/rateLimiter.js';
import { scheduleCacheMaintenance } from './security/dnsCache.js';
import { tlsPreflight } from './security/tlsPreflight.js';
import { JtiStore } from './idempotency/jtiStore.js';
import { db, forget, makeKey, rememberFinal, rememberPending, seen } from './idempotency/index.js';
import { scheduleGc } from './idempotency/scheduler.js';
import { signVerdict } from './verdictToken.js';
import {
  configureMetrics,
  setMetrics,
  httpResponses,
  idemHits,
  inflightGauge,
  registry,
  startUpstreamTimer,
  tokenFails,
  rateLimitBlocks,
  observeTtl,
  incIpMismatch,
  incTlsNameMismatch,
  incRedirectBlock,
} from './metrics.js';
import { recordAndMapError } from './errors-map.js';
import { requestContext } from './mw/requestContext.js';
import { log } from './logger.js';
import {
  SSRFDenyError,
  RedirectBadSchemeError,
  RedirectPrivateTargetError,
  RedirectTooManyError,
} from './errors.js';

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
  policyRev?: string | null;
  policySig?: string | null;
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

type PolicySignatureState = 'valid' | 'invalid';

const requirePolicySignature = process.env.VERIFY_GATE_REQUIRE_POLICY_SIGNATURE === '1';

type PolicyCacheState = {
  revision?: string | null;
  signature?: PolicySignatureState;
  fetchedAt: number;
};

const policyCache: PolicyCacheState = { fetchedAt: 0 };

function parsePolicySignature(value: string | null | undefined): PolicySignatureState | undefined {
  if (!value) {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === 'invalid') {
    return 'invalid';
  }
  if (normalized === 'valid') {
    return 'valid';
  }
  return undefined;
}

function rememberPolicyStatus(revision?: string | null, signature?: PolicySignatureState): void {
  let changed = false;
  if (revision && revision.trim().length > 0) {
    policyCache.revision = revision;
    changed = true;
  }
  if (signature) {
    policyCache.signature = signature;
    changed = true;
  }
  if (changed) {
    policyCache.fetchedAt = Date.now();
  }
}

function cachedPolicyRevision(): string | undefined {
  const cached = policyCache.revision;
  if (cached && cached.length > 0) {
    return cached;
  }
  const env = process.env.ETHICS_POLICY_REV?.trim();
  return env && env.length > 0 ? env : undefined;
}

function cachedPolicySignature(): PolicySignatureState | undefined {
  return policyCache.signature;
}

function applyPolicyHeaders(res: Response, revision?: string | null, signature?: string | null): void {
  const parsedSig = parsePolicySignature(signature);
  if (revision && revision.trim().length > 0) {
    res.setHeader('x-ethics-policy-rev', revision);
  } else {
    const cached = cachedPolicyRevision();
    if (cached) {
      res.setHeader('x-ethics-policy-rev', cached);
    }
  }
  if (parsedSig) {
    res.setHeader('x-ethics-policy-sig', parsedSig);
  } else {
    const cachedSig = cachedPolicySignature();
    if (cachedSig) {
      res.setHeader('x-ethics-policy-sig', cachedSig);
    }
  }
  rememberPolicyStatus(revision, parsedSig);
}

const tokenTtlSeconds = Math.max(Number.parseInt(process.env.VERIFY_GATE_TOKEN_TTL_SEC ?? '60', 10), 5);
const rateLimitRpm = Number.parseInt(process.env.VERIFY_GATE_RATE_RPM ?? '0', 10);

export type AppDeps = {
  registry?: Registry;
};

const jtiStore = new JtiStore(db);
scheduleGc(() => jtiStore.purge(), Number(process.env.VERIFY_GATE_GC_MS ?? process.env.VERIFY_GATE_IDEMP_TTL_MS ?? '60000'));

const rateLimiter = rateLimitRpm > 0 ? new RateLimiter(db, rateLimitRpm) : null;

if (process.env.NODE_ENV !== 'test') {
  const purgeMs = Number.parseInt(process.env.VERIFY_GATE_DNS_CACHE_PURGE_MS ?? '60000', 10);
  scheduleCacheMaintenance(Number.isFinite(purgeMs) && purgeMs > 0 ? purgeMs : 60000);
}

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

export function createApp(deps: AppDeps = {}): express.Express {
  const metricsApi = deps.registry ? configureMetrics(deps.registry) : configureMetrics();
  setMetrics(metricsApi);

  const app = express();
  app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
  app.disable('x-powered-by');
  app.use(helmet({ crossOriginResourcePolicy: false }));

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

  app.use(requestContext());
  app.use((req, _res, next) => {
    const rid = (req as Request & { rid?: string }).rid ?? randomUUID();
    (req as Request & { audit?: (extra: Record<string, unknown>) => void }).audit = (extra) => {
      log.info(
        {
          rid,
          route: req.path,
          method: req.method,
          ...extra,
        },
        'verify-gate decision',
      );
    };
    next();
  });

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
    const policyRevHeader = response.headers.get('x-ethics-policy-rev');
    const policySigHeader = response.headers.get('x-ethics-policy-sig');
    rememberPolicyStatus(policyRevHeader ?? undefined, parsePolicySignature(policySigHeader));
    const meta: JsonMeta = {
      degraded,
      policyRev: policyRevHeader,
      policySig: policySigHeader,
    };
    if (!response.ok) {
      return { ok: false, status: response.status, error: `HTTP_${response.status}`, meta };
    }

    const data = (await response.json()) as T;
    return { ok: true, status: response.status, data, meta };
  } catch (error) {
    const reason = error instanceof Error ? (error.name === 'AbortError' ? 'TIMEOUT' : error.message) : 'NETWORK_ERROR';
    const cachedRev = cachedPolicyRevision() ?? null;
    const cachedSig = cachedPolicySignature() ?? null;
    return {
      ok: false,
      status: null,
      error: reason ?? 'NETWORK_ERROR',
      meta: { degraded: undefined, policyRev: cachedRev, policySig: cachedSig },
    };
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
  const allowlistRaw =
    (process.env.VERIFY_GATE_SSRF_ALLOWLIST ?? process.env.VERIFY_GATE_UPSTREAM_ALLOWLIST ?? '').trim();
  if (!allowlistRaw) {
    return res.status(503).json({ ok: false, reason: 'config_missing_allowlist' });
  }
  if (!hasAllowlistEntries()) {
    return res.status(503).json({ ok: false, reason: 'allowlist_unset' });
  }

  const jwtMaterial = (process.env.VERIFY_GATE_JWT_SECRETS ?? process.env.VERIFY_GATE_JWT_SECRET ?? '').trim();
  if (!jwtMaterial) {
    return res.status(503).json({ ok: false, reason: 'config_missing_jwt' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1000);
  try {
    const response = await fetch(`${ethicsBase}/readyz`, { signal: controller.signal });
    if (!response.ok) {
      return res.status(503).json({ ok: false, reason: 'ethics_unavailable', status: response.status });
    }
    const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    let policyPayload: Record<string, unknown> | null = null;
    try {
      const policyController = new AbortController();
      const policyTimeout = setTimeout(() => policyController.abort(), 1500);
      try {
        const policyResponse = await fetch(`${ethicsBase}/policy/status`, { signal: policyController.signal });
        if (policyResponse.ok) {
          policyPayload = (await policyResponse.json().catch(() => ({}))) as Record<string, unknown>;
          const revision = typeof policyPayload?.revision === 'string' ? policyPayload.revision : null;
          const sigOk = policyPayload?.ok === true;
          rememberPolicyStatus(revision ?? undefined, sigOk ? 'valid' : 'invalid');
          if (requirePolicySignature && !sigOk) {
            return res
              .status(503)
              .json({ ok: false, reason: 'ethics_policy_signature_invalid', policy: policyPayload });
          }
        } else if (requirePolicySignature) {
          return res
            .status(503)
            .json({ ok: false, reason: 'ethics_policy_status_unreachable', status: policyResponse.status });
        }
      } finally {
        clearTimeout(policyTimeout);
      }
    } catch (policyError) {
      if (requirePolicySignature) {
        return res.status(503).json({
          ok: false,
          reason: 'ethics_policy_status_error',
          detail: String((policyError as Error).message ?? policyError),
        });
      }
    }

    const fallbackPolicy = policyPayload ?? {
      ok: cachedPolicySignature() !== 'invalid',
      revision: cachedPolicyRevision() ?? null,
      cached: true,
    };
    return res.json({ ok: true, ethics: payload, policy: fallbackPolicy });
  } catch (error) {
    return res.status(503).json({ ok: false, reason: 'ethics_check_failed', detail: String((error as Error).message ?? error) });
  } finally {
    clearTimeout(timeout);
  }
});

app.post('/gate/*', async (req: Request, res: Response) => {
  const requestId = typeof res.locals.requestId === 'string' ? res.locals.requestId : randomUUID();
  res.locals.requestId = requestId;

  const auditFn = (req as Request & { audit?: (extra: Record<string, unknown>) => void }).audit;
  let targetHost = 'unknown';
  const auditLog = (extra: Record<string, unknown>) => {
    auditFn?.({ request_id: requestId, target: targetHost, ...extra });
  };

  const path = forwardPath(req.originalUrl);
  let target: URL;
  try {
    target = new URL(path, `${upstreamBase}/`);
    targetHost = target.hostname;
  } catch {
    auditLog({ verdict: 'blocked', error: 'INVALID_TARGET_URL' });
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
    auditLog({ verdict: 'duplicate', error: 'idempotent_reuse', replay_request_id: reuseRequestId });
    return res.status(409).json({ ok: false, reason: 'duplicate', requestId: reuseRequestId });
  }

  if (rateLimiter) {
    const decision = rateLimiter.take(subject);
    if (!decision.allowed) {
      rateLimitBlocks.inc({ scope: 'subject' });
      auditLog({ verdict: 'blocked', error: 'rate_limited', scope: 'subject' });
      return res.status(429).json({ ok: false, error: 'rate_limited', scope: 'subject' });
    }
  }

  let allowResult: Awaited<ReturnType<typeof assertAllowed>>;
  try {
    allowResult = await assertAllowed(target.toString());
  } catch (error) {
    if (error instanceof SSRFDenyError) {
      auditLog({ verdict: 'blocked', error: error.message });
      return res.status(403).json({ ok: false, error: error.message });
    }
    auditLog({ verdict: 'blocked', error: 'TARGET_NOT_ALLOWED' });
    return res.status(403).json({ ok: false, error: 'TARGET_NOT_ALLOWED' });
  }

  let finalTarget = new URL(allowResult.url.toString());
  let redirectHops = 0;
  let schemeHistory: string[] = [finalTarget.protocol.replace(/:$/, '')];
  const maxRedirects = Number.parseInt(process.env.VERIFY_GATE_MAX_REDIRECTS ?? '3', 10);
  let tlsRemoteIp: string | undefined;
  let tlsSanOk: boolean | undefined;
  let tlsIpMismatch = false;
  try {
    const redirectResult = await followRedirectsWithPreflight(
      target,
      { allow: allowResult },
      Number.isFinite(maxRedirects) ? maxRedirects : 3,
    );
    finalTarget = redirectResult.final;
    allowResult = redirectResult.ctx.allow;
    redirectHops = redirectResult.hops;
    schemeHistory = redirectResult.schemeHistory;
    targetHost = finalTarget.hostname;
  } catch (error) {
    if (error instanceof RedirectBadSchemeError) {
      auditLog({ verdict: 'blocked', error: 'redirect_bad_scheme' });
      return res.status(400).json({ ok: false, error: 'redirect_bad_scheme' });
    }
    if (error instanceof RedirectPrivateTargetError) {
      auditLog({ verdict: 'blocked', error: 'redirect_private_target' });
      return res.status(403).json({ ok: false, error: 'redirect_private_target' });
    }
    if (error instanceof RedirectTooManyError) {
      auditLog({ verdict: 'blocked', error: 'redirect_too_many' });
      return res.status(400).json({ ok: false, error: 'redirect_too_many' });
    }
    auditLog({ verdict: 'blocked', error: 'redirect_follow_failed' });
    return res.status(502).json({ ok: false, error: 'redirect_follow_failed' });
  }

  try {
    allowResult = await assertAllowed(finalTarget.toString());
  } catch (error) {
    if (error instanceof SSRFDenyError) {
      auditLog({ verdict: 'blocked', error: error.message });
      return res.status(403).json({ ok: false, error: error.message });
    }
    auditLog({ verdict: 'blocked', error: 'TARGET_NOT_ALLOWED' });
    return res.status(403).json({ ok: false, error: 'TARGET_NOT_ALLOWED' });
  }

  const pinnedIpNormalized = normalizeIp(allowResult.ip);

  if (finalTarget.protocol === 'https:') {
    try {
      const { remoteAddress, sanOk } = await tlsPreflight(
        finalTarget.hostname,
        allowResult.ip,
        Number(finalTarget.port || 443),
      );
      tlsSanOk = sanOk;
      tlsRemoteIp = remoteAddress;
      const remoteNormalized = remoteAddress ? normalizeIp(remoteAddress) : undefined;
      if (remoteNormalized && remoteNormalized !== pinnedIpNormalized) {
        incIpMismatch(finalTarget.hostname);
        tlsIpMismatch = true;
        throw new Error('IP_MISMATCH_PREFLIGHT');
      }
      if (!sanOk) {
        incTlsNameMismatch(finalTarget.hostname);
        throw new Error('TLS_SAN_MISMATCH');
      }
    } catch (error) {
      incRedirectBlock('tls-preflight-fail', target.hostname);
      auditLog({ verdict: 'blocked', error: 'tls_preflight_failed' });
      return res.status(502).json({ ok: false, error: 'tls_preflight_failed' });
    }
  }

  observeTtl(allowResult.hostname, allowResult.minTTLsec);

  const netContext = {
    hostname_ascii: allowResult.hostname,
    resolved_ip: allowResult.ip,
    cname_chain: allowResult.chain,
    min_ttl_sec: allowResult.minTTLsec,
    ttl_sec: allowResult.minTTLsec,
    is_private: allowResult.ips.some((ip) => isPrivateOrBlocked(ip)),
    redirect_hops: redirectHops,
    scheme_history: schemeHistory,
    tls_remote_ip: tlsRemoteIp,
    tls_san_ok: tlsSanOk,
    tls_ip_mismatch: tlsIpMismatch,
  };

  const ttlLevel = allowResult.minTTLsec < 10 ? 'critical' : allowResult.minTTLsec < 30 ? 'warn' : 'ok';
  const redirectLevel = redirectHops >= 3 ? 'critical' : redirectHops > 0 ? 'warn' : 'ok';
  const buildNetworkSignals = () => {
    const tlsLevel =
      finalTarget.protocol === 'https:' ? (!tlsSanOk || tlsIpMismatch ? 'critical' : 'ok') : 'ok';
    return {
      ttl: { seconds: allowResult.minTTLsec, level: ttlLevel },
      redirect: { hops: redirectHops, level: redirectLevel, schemes: schemeHistory },
      tls:
        finalTarget.protocol === 'https:'
          ? {
              sanOk: tlsSanOk ?? false,
              ipMismatch: tlsIpMismatch,
              remoteIp: tlsRemoteIp,
              pinnedIp: pinnedIpNormalized,
              level: tlsLevel,
            }
          : undefined,
    };
  };

  let networkSignals = buildNetworkSignals();
  res.setHeader('x-verify-network', JSON.stringify(networkSignals));

  const ethicsUrl = `${ethicsBase}/ethics/check`;
  const verdictResult = await postJson<EthicsResponseBody>(
    ethicsUrl,
    {
      intent: req.originalUrl.replace(/^\/gate\//, ''),
      content: req.body,
      context: req.body?.context,
      net: netContext,
    },
    { 'x-request-id': requestId },
  );

  applyPolicyHeaders(res, verdictResult.meta?.policyRev ?? null, verdictResult.meta?.policySig ?? null);
  const policyRevisionHint = verdictResult.meta?.policyRev ?? cachedPolicyRevision();

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
    auditLog({ verdict: 'blocked', error: 'ethics_unreachable', status: statusCode, redirect_hops: redirectHops });
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
    auditLog({ verdict, error: verdictBody?.reason ?? 'verification_failed', redirect_hops: redirectHops });
    return res.status(428).json({
      ok: false,
      verdict,
      reason: verdictBody?.reason ?? 'verification_failed',
      neededEvidence: verdictBody?.neededEvidence ?? ['weitere Evidenz erforderlich'],
    });
  }

  const bodyHash = bodySha256(req.body);
  const body = req.body !== undefined && req.body !== null ? JSON.stringify(req.body) : undefined;
  const upstreamHeaders = buildUpstreamHeaders(req, finalTarget.host);
  if (degradedHeaderValue) {
    upstreamHeaders.set('x-verify-degraded', degradedHeaderValue);
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
      policyRevision: policyRevisionHint ?? undefined,
    });
    if (jtiStore.seen(claims.jti, claims.exp)) {
      rateLimitBlocks.inc({ scope: 'jti' });
      return res.status(409).json({ ok: false, reason: 'jwt_replay', requestId });
    }
    upstreamHeaders.set('x-ethics-token', verdictToken);
  } catch (error) {
    tokenFails.inc({ reason: 'sign_error' });
    log.error({ err: error, rid: requestId }, 'verify-gate failed to sign verdict token');
    return res.status(500).json({ ok: false, error: 'verdict_token_sign_failed' });
  }
  const controller = new AbortController();
  const stopTimer = startUpstreamTimer(req.method ?? 'GET', routeKey);
  let timerStopped = false;
  const stopOnce = (code: string) => {
    if (!timerStopped) {
      stopTimer(code);
      timerStopped = true;
    }
  };

  req.on('close', () => controller.abort());

  try {
    rememberPending(idemKey, requestId);

    const headerRecord: Record<string, string | string[]> = {};
    upstreamHeaders.forEach((value, key) => {
      headerRecord[key] = value;
    });

    const upstreamMethod = (req.method ?? 'GET').toUpperCase();

    const pinned = await pinnedRequest({
      originalUrl: finalTarget,
      pinnedIp: allowResult.ip,
      minTTLsec: allowResult.minTTLsec,
      method: upstreamMethod,
      headers: headerRecord,
      body,
      signal: controller.signal,
    });

    if (!tlsRemoteIp && pinned.remoteIp) {
      tlsRemoteIp = pinned.remoteIp;
    }
    if (typeof pinned.sanOk === 'boolean') {
      tlsSanOk = pinned.sanOk;
    }
    networkSignals = buildNetworkSignals();
    res.setHeader('x-verify-network', JSON.stringify(networkSignals));

    stopOnce(String(pinned.res.statusCode));

    if (pinned.res.statusCode === 428 || pinned.res.statusCode === 401) {
      tokenFails.inc({ reason: pinned.res.statusCode === 401 ? 'upstream_401' : 'upstream_428' });
    }

    try {
      await pinned.pipeTo(res);
      rememberFinal(idemKey, pinned.res.statusCode, requestId, verdict, evidenceCount);
      auditLog({
        verdict: 'proxied',
        status: pinned.res.statusCode,
        redirect_hops: redirectHops,
        tls_san_ok: tlsSanOk ?? null,
        ttl_sec: allowResult.minTTLsec,
        resolved_ip: allowResult.ip,
      });
    } catch (streamError) {
      forget(idemKey);
      throw streamError;
    } finally {
      pinned.dispose();
    }
  } catch (error) {
    stopOnce('error');
    log.error(
      {
        err: error,
        target: finalTarget?.toString() ?? targetUrl,
        rid: requestId,
      },
      'verify-gate upstream call failed',
    );
    forget(idemKey);
    const mapped = recordAndMapError(error, metricsApi, { host: targetHost });
    auditLog({
      verdict: 'error',
      error: mapped.code,
      message: mapped.message,
      redirect_hops: redirectHops,
      tls_san_ok: tlsSanOk ?? null,
      ttl_sec: allowResult.minTTLsec,
      resolved_ip: allowResult.ip,
    });
    res.status(mapped.status).json({ ok: false, error: mapped.code, message: mapped.message });
  }
  });

  return app;
}
