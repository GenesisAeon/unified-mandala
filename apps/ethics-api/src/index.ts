import { createHash, randomBytes, randomUUID } from 'node:crypto';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  collectDefaultMetrics,
  Counter,
  Gauge,
  Histogram,
  Registry,
} from 'prom-client';
import { fetchJson } from './http-client.js';
import {
  configureBoundaryCircuit,
  getBoundaryCircuitStateValue,
  observeBoundary,
  type BoundaryResponse,
  type BoundaryViolation,
} from './boundary-client.js';
import { EthicsCheckSchema, type EthicsCheckInput } from './schemas.js';
import { parse as parseDomain } from 'tldts';
import { evaluateOpa } from './opa.js';
import {
  assertEthicsInput,
  assertNetworkSignals,
  InvalidEthicsInputError,
  MissingNetworkSignalsError,
} from './schemas/opa-input.schema.js';

interface RagCitation {
  uri?: string;
  text?: string;
  score?: number;
  strength?: 'strong' | 'standard';
  [key: string]: unknown;
}

interface RagResponse {
  score?: number;
  citations?: RagCitation[];
  [key: string]: unknown;
}

interface EthicsVerdict {
  verdict: 'green' | 'yellow' | 'red';
  reason: string;
}

interface EthicsCheckResult {
  ok: boolean;
  verdict: 'green' | 'yellow' | 'red';
  reason: string;
  grounding: {
    score: number;
    citations: RagCitation[];
  };
  boundary: {
    count: number;
    violations: BoundaryViolation[];
  };
  impact: {
    co2eKgMin: number;
    co2eKgMax: number;
    riskScore: number;
  };
  neededEvidence: string[];
  deps?: Record<string, unknown>;
  evidence?: { domains: string[]; strong: number };
}

const app = express();
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: false }));

const ajv = addFormats(new Ajv({ allErrors: true }));
const validateEthics = ajv.compile<EthicsCheckInput>(EthicsCheckSchema);

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

app.use(requestIdMiddleware);

const bodyLimit = process.env.ETHICS_JSON_LIMIT ?? '1mb';
app.use(express.json({ limit: bodyLimit }));

const offset = Number.parseInt(process.env.PORT_OFFSET ?? '0', 10) || 0;
const defaultPort = 3110 + offset;
const configuredPort = Number.parseInt(process.env.ETHICS_PORT ?? '', 10);
const port = Number.isFinite(configuredPort) ? configuredPort + offset : defaultPort;
const host = process.env.ETHICS_HOST ?? '127.0.0.1';
const boundaryPort = Number.parseInt(process.env.BOUNDARY_PORT ?? '', 10);
const ragPort = Number.parseInt(process.env.RAG_API_PORT ?? '', 10);
const boundaryUrl = `http://127.0.0.1:${Number.isFinite(boundaryPort) ? boundaryPort : 4010 + offset}`;
const ragBaseUrl = `http://127.0.0.1:${Number.isFinite(ragPort) ? ragPort : 3003 + offset}`;

const registry = new Registry();
collectDefaultMetrics({ register: registry });

const dependencyFailureCounter = new Counter({
  name: 'ethics_dependency_unreachable_total',
  help: 'Total count of failed dependency calls by dependency and reason',
  labelNames: ['dependency', 'reason'],
  registers: [registry],
});

const verdictCounter = new Counter({
  name: 'ethics_verdict_total',
  help: 'Count of ethics verdicts by outcome',
  labelNames: ['verdict'],
  registers: [registry],
});

const decisionLogCounter = new Counter({
  name: 'ethics_decision_log_total',
  help: 'Aggregated ethics decisions by verdict and reason',
  labelNames: ['verdict', 'reason'],
  registers: [registry],
});

const checkDuration = new Histogram({
  name: 'ethics_check_duration_ms',
  help: 'Duration of ethics checks in milliseconds',
  buckets: [25, 50, 100, 250, 500, 1000, 2000, 5000],
  registers: [registry],
});

const circuitGauge = new Gauge({
  name: 'boundary_circuit_state',
  help: 'Circuit breaker state for boundary dependency (0=closed,1=half_open,2=open)',
  registers: [registry],
});

const degradedCounter = new Counter({
  name: 'ethics_degraded_total',
  help: 'Count of degraded ethics responses by dependency',
  labelNames: ['dependency'],
  registers: [registry],
});

const evidenceDomainCounter = new Counter({
  name: 'ethics_evidence_domains_total',
  help: 'Count of unique evidence domains observed in responses',
  labelNames: ['domain'],
  registers: [registry],
});

const dependencyFailMode = (process.env.ETHICS_DEP_FAIL_MODE ?? 'red').toLowerCase();
const logSampleGreen = Number.parseFloat(process.env.LOG_SAMPLE_GREEN ?? '0.01');

const circuitOptions: { failureThreshold?: number; halfOpenAfterMs?: number } = {};
const cbFailureThreshold = Number.parseInt(process.env.BOUNDARY_CB_FAILS ?? '', 10);
if (Number.isFinite(cbFailureThreshold)) {
  circuitOptions.failureThreshold = cbFailureThreshold;
}
const cbCooldownMs = Number.parseInt(process.env.BOUNDARY_CB_COOLDOWN_MS ?? '', 10);
if (Number.isFinite(cbCooldownMs)) {
  circuitOptions.halfOpenAfterMs = cbCooldownMs;
}
configureBoundaryCircuit(circuitOptions);

function updateCircuitGauge(): void {
  circuitGauge.set(getBoundaryCircuitStateValue());
}

updateCircuitGauge();

const boundaryCacheTtlMs = Number.parseInt(process.env.ETHICS_CACHE_TTL_MS ?? '60000', 10);
const boundaryCache = new Map<string, { expires: number; value: BoundaryResponse }>();
const uniqueDomainRequirement = Math.max(
  1,
  Number.parseInt(process.env.ETHICS_REQUIRE_UNIQUE_EVIDENCE_DOMAINS ?? '2', 10),
);

const EXPOSE_HEADERS = [
  'x-ethics-verdict',
  'x-ethics-evidence-count',
  'x-ethics-degraded',
  'x-request-id',
  'traceparent',
  'tracestate',
];

interface LifeboatFinding {
  rule: string;
  reason: string;
}

const lifeboatRules: Array<{ id: string; pattern: RegExp; reason: string }> = [
  { id: 'hate_speech', pattern: /\b(kill|exterminate|eliminate)\s+all\s+(men|women|people|[a-z]+)\b/i, reason: 'hate_content' },
  { id: 'pii_redaction', pattern: /(social security|ssn|passport|credit card|iban)[^a-z0-9]?\s*([0-9\-]{4,})/i, reason: 'pii_detected' },
  { id: 'advance_fee', pattern: /\b(double\s+your\s+money|wire\s+transfer\s+fee|crypto\s+investment\s+guarantee)\b/i, reason: 'scam_detected' },
  { id: 'payment_scam', pattern: /\b(quick\s*cash|guaranteed\s*returns|wire\s*me\s*first|crypto\s*giveaway)\b/i, reason: 'scam_detected' },
  { id: 'malware_distribution', pattern: /(download|install).*(keylogger|ransomware|trojan|stealer)/i, reason: 'malware_distribution' },
  { id: 'impersonation', pattern: /(impersonate|pretend\s+to\s+be|spoof).*(bank|support|official|employee)/i, reason: 'impersonation_detected' },
];

function evaluateLifeboat(text: string): LifeboatFinding | null {
  for (const rule of lifeboatRules) {
    if (rule.pattern.test(text)) {
      return { rule: rule.id, reason: rule.reason };
    }
  }
  return null;
}

function exposeEthicsHeaders(res: Response): void {
  const existing = res.getHeader('Access-Control-Expose-Headers');
  const expose = new Set<string>();
  if (typeof existing === 'string') {
    existing
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .forEach((value) => expose.add(value));
  } else if (Array.isArray(existing)) {
    for (const entry of existing) {
      if (typeof entry === 'string') {
        entry
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
          .forEach((value) => expose.add(value));
      }
    }
  }
  EXPOSE_HEADERS.forEach((header) => expose.add(header));
  res.setHeader('Access-Control-Expose-Headers', Array.from(expose).join(', '));
}

function ensureTraceContext(req: Request, res: Response): { traceparent: string; tracestate?: string } {
  const incomingTrace = typeof req.get('traceparent') === 'string' ? req.get('traceparent')?.trim() : undefined;
  const tracestate = typeof req.get('tracestate') === 'string' ? req.get('tracestate')?.trim() : undefined;
  const newSpanId = randomBytes(8).toString('hex');

  let traceparent: string;
  if (incomingTrace) {
    const parts = incomingTrace.split('-');
    if (parts.length >= 4) {
      parts[2] = newSpanId;
      traceparent = `${parts[0]}-${parts[1]}-${parts[2]}-${parts[3]}`;
    } else {
      const traceId = randomBytes(16).toString('hex');
      traceparent = `00-${traceId}-${newSpanId}-01`;
    }
  } else {
    const traceId = randomBytes(16).toString('hex');
    traceparent = `00-${traceId}-${newSpanId}-01`;
  }

  res.setHeader('traceparent', traceparent);
  if (tracestate) {
    res.setHeader('tracestate', tracestate);
  }
  (req.headers as Record<string, unknown>)['traceparent'] = traceparent;
  if (tracestate) {
    (req.headers as Record<string, unknown>)['tracestate'] = tracestate;
  }
  return { traceparent, tracestate: tracestate ?? undefined };
}

function boundaryCacheKey(text: string, context: unknown): string {
  const hash = createHash('sha1');
  hash.update(text ?? '');
  hash.update('::');
  hash.update(JSON.stringify(context ?? {}));
  return hash.digest('hex');
}

function getBoundaryFromCache(key: string): BoundaryResponse | null {
  const cached = boundaryCache.get(key);
  if (!cached) {
    return null;
  }
  if (cached.expires <= Date.now()) {
    boundaryCache.delete(key);
    return null;
  }
  return cached.value;
}

function setBoundaryCache(key: string, value: BoundaryResponse): void {
  if (boundaryCacheTtlMs <= 0) {
    return;
  }
  boundaryCache.set(key, { expires: Date.now() + boundaryCacheTtlMs, value });
}

function effectiveDomain(url: string | undefined): string | null {
  if (!url) {
    return null;
  }
  try {
    const parsed = parseDomain(url, { allowPrivateDomains: true });
    if (parsed.domain) {
      return parsed.domain.toLowerCase();
    }
    if (parsed.hostname) {
      return parsed.hostname.replace(/^www\./, '').toLowerCase();
    }
    const fallback = new URL(url);
    return fallback.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

const STRONG_DOMAIN_MATCHERS = [
  /^doi\.org$/i,
  /^arxiv\.org$/i,
  /\.gov(?:\.[a-z]+)?$/i,
];

function isStrongEvidenceDomain(domain: string, uri?: string): boolean {
  if (uri && uri.startsWith('https://doi.org/')) {
    return true;
  }
  return STRONG_DOMAIN_MATCHERS.some((pattern) => pattern.test(domain));
}

function canonicalizeCitations(citations: RagCitation[]): { filtered: RagCitation[]; domains: string[] } {
  const seen = new Set<string>();
  const filtered: RagCitation[] = [];
  const domains: string[] = [];
  for (const citation of citations) {
    const domain = effectiveDomain(typeof citation.uri === 'string' ? citation.uri : undefined);
    if (!domain) {
      continue;
    }
    if (seen.has(domain)) {
      continue;
    }
    seen.add(domain);
    domains.push(domain);
    const strength = isStrongEvidenceDomain(domain, typeof citation.uri === 'string' ? citation.uri : undefined)
      ? 'strong'
      : 'standard';
    filtered.push({ ...citation, uri: citation.uri, strength });
  }
  return { filtered, domains };
}

function hashDecisionPayload(text: string, context: unknown): string {
  const hash = createHash('sha1');
  hash.update(text ?? '');
  hash.update('::');
  hash.update(JSON.stringify(context ?? {}));
  return hash.digest('hex');
}

function parseText(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (value === undefined || value === null) {
    return '';
  }
  return JSON.stringify(value);
}

function scoreToVerdict(score: number, evidenceCount: number, uniqueDomains: number, hasViolations: boolean): EthicsVerdict {
  const minGreen = Number.parseFloat(process.env.VERIFY_MIN_SCORE_GREEN ?? '0.7');
  const minYellow = Number.parseFloat(process.env.VERIFY_MIN_SCORE_YELLOW ?? '0.4');
  const minEvidence = Number.parseInt(process.env.VERIFY_MIN_EVIDENCE ?? '2', 10);

  if (hasViolations) {
    return { verdict: 'red', reason: 'boundary_violation' };
  }
  if (uniqueDomains < uniqueDomainRequirement) {
    return { verdict: 'yellow', reason: 'insufficient_unique_domains' };
  }
  if (score >= minGreen && evidenceCount >= minEvidence) {
    return { verdict: 'green', reason: 'grounded' };
  }
  if (score >= minYellow) {
    return { verdict: 'yellow', reason: 'insufficient_evidence' };
  }
  return { verdict: 'red', reason: 'insufficient_grounding' };
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, service: 'ethics', ts: new Date().toISOString() });
});

app.get('/metrics', async (_req: Request, res: Response) => {
  res.setHeader('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

app.get('/readyz', (_req: Request, res: Response) => {
  updateCircuitGauge();
  const value = getBoundaryCircuitStateValue();
  const warm = boundaryCache.size > 0;
  if (value !== 0) {
    return res.status(503).json({ ok: false, cb: value, boundary_cache_warm: warm });
  }
  return res.json({ ok: true, boundary_cache_warm: warm });
});

app.post(
  '/ethics/check',
  async (req: Request<Record<string, string>, unknown, EthicsCheckInput>, res: Response) => {
  const stopTimer = checkDuration.startTimer();
  try {
    const payload = (req.body ?? {}) as EthicsCheckInput;
    if (!validateEthics(payload)) {
      const issues = (validateEthics.errors ?? []).map((error) => ({
        instancePath: error.instancePath,
        message: error.message,
        keyword: error.keyword,
      }));
      return res.status(400).json({ ok: false, error: 'BAD_REQUEST', issues });
    }

    const { intent, content, context } = payload;
    const minEvidenceRequired = Number.parseInt(process.env.VERIFY_MIN_EVIDENCE ?? '2', 10);
    const text = parseText(content ?? intent);
    const trace = ensureTraceContext(req, res);
    const requestId = typeof res.locals.requestId === 'string' ? res.locals.requestId : randomUUID();
    res.locals.requestId = requestId;

    const lifeboat = evaluateLifeboat(text);
    if (lifeboat) {
      const lifeboatResponse: EthicsCheckResult = {
        ok: false,
        verdict: 'red',
        reason: lifeboat.reason,
        neededEvidence: [],
        deps: { lifeboatRule: lifeboat.rule },
        grounding: { score: 0, citations: [] },
        boundary: { count: 0, violations: [] },
        impact: { co2eKgMin: 0, co2eKgMax: 0, riskScore: 1 },
      };
      verdictCounter.inc({ verdict: 'red' });
      decisionLogCounter.inc({ verdict: 'red', reason: lifeboat.reason });
      res.setHeader('x-ethics-verdict', 'red');
      res.setHeader('x-ethics-evidence-count', '0');
      exposeEthicsHeaders(res);
      return res.status(200).json(lifeboatResponse);
    }

    const cacheKey = boundaryCacheKey(text, context);
    let boundaryData: BoundaryResponse | null = null;
    if (boundaryCacheTtlMs > 0) {
      boundaryData = getBoundaryFromCache(cacheKey);
    }

    if (!boundaryData) {
      const boundaryResult = await observeBoundary(boundaryUrl, text, context, {
        headers: {
          'x-request-id': requestId,
          traceparent: trace.traceparent,
          ...(trace.tracestate ? { tracestate: trace.tracestate } : {}),
        },
      });
      updateCircuitGauge();

      if (!boundaryResult.ok) {
        const reason = boundaryResult.error === 'CB_OPEN' ? 'circuit_open' : boundaryResult.error ?? 'unknown';
        dependencyFailureCounter.inc({ dependency: 'boundary', reason });
        degradedCounter.inc({ dependency: 'boundary' });
        const failureResponse: EthicsCheckResult = {
          ok: false,
          verdict: 'red',
          reason: reason === 'circuit_open' ? 'boundary_circuit_open' : 'boundary_unreachable',
          neededEvidence: [],
          deps: { boundary: boundaryResult.error },
          grounding: { score: 0, citations: [] },
          boundary: { count: 0, violations: [] },
          impact: { co2eKgMin: 0, co2eKgMax: 0, riskScore: 1 },
        };
        verdictCounter.inc({ verdict: 'red' });
        decisionLogCounter.inc({ verdict: 'red', reason: failureResponse.reason });
        res.setHeader('x-ethics-verdict', 'red');
        res.setHeader('x-ethics-evidence-count', '0');
        res.setHeader('x-ethics-degraded', 'boundary');
        exposeEthicsHeaders(res);
        if (dependencyFailMode === 'error') {
          return res.status(503).json(failureResponse);
        }
        return res.status(200).json(failureResponse);
      }

      boundaryData = boundaryResult.data ?? { violations: [] };
      setBoundaryCache(cacheKey, boundaryData);
    }

    const violations = Array.isArray(boundaryData?.violations)
      ? (boundaryData?.violations as BoundaryViolation[])
      : [];

    const ragCandidates = ['/rag/ask', '/ask', '/query'];
    let ragResponse: RagResponse | null = null;
    for (const candidate of ragCandidates) {
      const ragResult = await fetchJson<RagResponse>(`${ragBaseUrl}${candidate}`, {
        method: 'POST',
        body: {
          question: parseText(intent),
          text,
        },
        timeoutMs: Number.parseInt(process.env.RAG_TIMEOUT_MS ?? '1500', 10),
        retries: Number.parseInt(process.env.RAG_RETRIES ?? '1', 10),
        headers: {
          'x-request-id': requestId,
          traceparent: trace.traceparent,
          ...(trace.tracestate ? { tracestate: trace.tracestate } : {}),
        },
      });
      if (ragResult.ok) {
        ragResponse = ragResult.data;
        break;
      }
    }

    const citations = Array.isArray(ragResponse?.citations)
      ? (ragResponse?.citations as RagCitation[])
      : [];
    const { filtered: canonicalCitations, domains } = canonicalizeCitations(citations);
    const strongEvidenceCount = canonicalCitations.filter((citation) => citation.strength === 'strong').length;
    domains.forEach((domain) => {
      evidenceDomainCounter.inc({ domain });
    });
    const uniqueDomainCount = domains.length;
    const score = typeof ragResponse?.score === 'number'
      ? ragResponse.score
      : canonicalCitations.length >= minEvidenceRequired
        ? 0.72
        : 0.35;

    const verdict = scoreToVerdict(score, canonicalCitations.length, uniqueDomainCount, violations.length > 0);
    const baseNeededEvidence =
      verdict.verdict === 'green'
        ? []
        : verdict.reason === 'insufficient_unique_domains'
          ? ['second independent domain']
          : ['mindestens zwei belastbare Quellen', 'konkreten Kontext für die Empfehlung'];

    let response: EthicsCheckResult = {
      ok: true,
      verdict: verdict.verdict,
      reason: verdict.reason,
      grounding: {
        score,
        citations: canonicalCitations,
      },
      boundary: {
        count: violations.length,
        violations,
      },
      impact: {
        co2eKgMin: 0,
        co2eKgMax: 0,
        riskScore: violations.length > 0 ? 0.9 : 0.1,
      },
      neededEvidence: baseNeededEvidence,
      deps: {},
      evidence: {
        domains,
        strong: strongEvidenceCount,
      },
    };

    (response.deps as Record<string, unknown>).evidence = response.evidence;

    const opaFlags: Record<string, unknown> = payload.flags ?? {};
    const flagsRecord = payload.flags as Record<string, unknown> | undefined;
    const degradeFlag = flagsRecord?.degraded === true;

    const fallbackIntentCandidate = (payload as Record<string, unknown>)['intentType'];
    const fallbackIntent =
      typeof fallbackIntentCandidate === 'string' ? fallbackIntentCandidate : '';

    const netPayload = payload.net as (typeof payload.net & Record<string, unknown>) | undefined;
    const opaNet = netPayload
      ? {
          ttl_sec:
            typeof netPayload.ttl_sec === 'number' && Number.isFinite(netPayload.ttl_sec)
              ? netPayload.ttl_sec
              : typeof netPayload.min_ttl_sec === 'number' && Number.isFinite(netPayload.min_ttl_sec)
                ? netPayload.min_ttl_sec
                : undefined,
          min_ttl_sec:
            typeof netPayload.min_ttl_sec === 'number' && Number.isFinite(netPayload.min_ttl_sec)
              ? netPayload.min_ttl_sec
              : undefined,
          tls_san_ok:
            typeof netPayload.tls_san_ok === 'boolean'
              ? Boolean(netPayload.tls_san_ok)
              : undefined,
          resolved_ip:
            typeof netPayload.resolved_ip === 'string' && netPayload.resolved_ip.length > 0
              ? netPayload.resolved_ip
              : undefined,
          redirect_hops:
            typeof netPayload.redirect_hops === 'number'
              ? Number(netPayload.redirect_hops)
              : undefined,
          is_private: netPayload.is_private === true,
        }
      : undefined;

    const severityValues = violations
      .map((violation) => (typeof violation.severity === 'string' ? violation.severity.toLowerCase() : undefined))
      .filter((value): value is 'low' | 'medium' | 'high' => value === 'low' || value === 'medium' || value === 'high');

    let severityMax: 'low' | 'medium' | 'high' | undefined;
    if (severityValues.includes('high')) {
      severityMax = 'high';
    } else if (severityValues.includes('medium')) {
      severityMax = 'medium';
    } else if (severityValues.includes('low')) {
      severityMax = 'low';
    }

    const boundaryMeta = { has_violations: violations.length > 0 } as {
      has_violations: boolean;
      severity_max?: 'low' | 'medium' | 'high';
    };
    if (severityMax) {
      boundaryMeta.severity_max = severityMax;
    }

    const opaInput = {
      degraded: degradeFlag,
      intent:
        typeof payload.intent === 'string' && payload.intent.length > 0
          ? payload.intent
          : fallbackIntent,
      content: typeof payload.content === 'string' && payload.content.length > 0 ? payload.content : text,
      risk: { high: violations.length > 0 || score < 0.5 },
      evidence: {
        domains,
        domains_distinct: domains.length,
        strong: strongEvidenceCount,
      },
      boundary: boundaryMeta,
      flags: opaFlags,
      network: opaNet,
    };

    try {
      assertEthicsInput(opaInput);
      if (!opaInput.degraded) {
        assertNetworkSignals(opaInput);
      }
    } catch (error) {
      if (error instanceof InvalidEthicsInputError) {
        return res.status(400).json({ ok: false, error: error.code, details: error.details });
      }
      if (error instanceof MissingNetworkSignalsError) {
        return res.status(428).json({ ok: false, error: 'precondition_required', reason: error.message });
      }
      throw error;
    }

    const opaResult = await evaluateOpa(opaInput);

    if (opaResult.enforced && opaResult.deny) {
      response = {
        ...response,
        ok: false,
        verdict: 'red',
        reason: opaResult.reason ?? 'policy_denied',
        neededEvidence: opaResult.reasons && opaResult.reasons.length > 0 ? opaResult.reasons : [],
        deps: {
          ...(response.deps ?? {}),
          opa: {
            reason: opaResult.reason ?? 'policy_denied',
            reasons: opaResult.reasons ?? [],
          },
        },
      };
    }

    verdictCounter.inc({ verdict: response.verdict });
    decisionLogCounter.inc({ verdict: response.verdict, reason: response.reason });

    res.setHeader('x-ethics-verdict', response.verdict);
    res.setHeader('x-ethics-evidence-count', String(response.grounding.citations.length));
    exposeEthicsHeaders(res);

    const shouldLog = response.verdict !== 'green' || Math.random() < logSampleGreen;
    if (shouldLog) {
      console.info('[ethics-api] decision', {
        requestId,
        traceparent: trace.traceparent,
        verdict: response.verdict,
        reason: response.reason,
        payload: hashDecisionPayload(text, context),
        deps: response.deps ?? {},
        evidenceDomains: domains,
      });
    }

    res.json(response);
  } catch (error) {
    console.error('[ethics-api] check failed', error);
    res.status(500).json({ ok: false, error: 'check_failed', detail: String((error as Error).message ?? error) });
  } finally {
    stopTimer();
  }
  },
);

app.post('/impact/report', (req: Request, res: Response) => {
  res.json({ ok: true, stored: req.body ?? {} });
});

app.post('/consent/issue', (req: Request, res: Response) => {
  const now = new Date().toISOString();
  const scope = typeof req.body?.scope === 'string' ? req.body.scope : 'unspecified';
  const subject = typeof req.body?.subject === 'string' ? req.body.subject : 'unknown';
  const ttlDays = typeof req.body?.ttlDays === 'number' ? req.body.ttlDays : 30;
  const receipt = {
    subject,
    scope,
    ttlDays,
    issuedAt: now,
    signature: `demo-signature-${now}`,
  };
  res.json({ ok: true, receipt });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, host, () => {
    console.log(`[ethics-api] listening on http://${host}:${port}`);
  });
}

export { app };
