import { randomUUID } from 'node:crypto';
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

interface RagCitation {
  uri?: string;
  text?: string;
  score?: number;
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

const dependencyFailMode = (process.env.ETHICS_DEP_FAIL_MODE ?? 'red').toLowerCase();

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

function parseText(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (value === undefined || value === null) {
    return '';
  }
  return JSON.stringify(value);
}

function scoreToVerdict(score: number, evidenceCount: number, hasViolations: boolean): EthicsVerdict {
  const minGreen = Number.parseFloat(process.env.VERIFY_MIN_SCORE_GREEN ?? '0.7');
  const minYellow = Number.parseFloat(process.env.VERIFY_MIN_SCORE_YELLOW ?? '0.4');
  const minEvidence = Number.parseInt(process.env.VERIFY_MIN_EVIDENCE ?? '2', 10);

  if (hasViolations) {
    return { verdict: 'red', reason: 'boundary_violation' };
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
  if (value !== 0) {
    return res.status(503).json({ ok: false, cb: value });
  }
  return res.json({ ok: true });
});

app.post('/ethics/check', async (req: Request<unknown, unknown, EthicsCheckInput>, res: Response) => {
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
    const requestId = typeof res.locals.requestId === 'string' ? res.locals.requestId : randomUUID();
    res.locals.requestId = requestId;

    const boundaryResult = await observeBoundary(boundaryUrl, text, context, {
      headers: { 'x-request-id': requestId },
    });
    updateCircuitGauge();

    if (!boundaryResult.ok) {
      const reason = boundaryResult.error === 'CB_OPEN' ? 'circuit_open' : boundaryResult.error ?? 'unknown';
      dependencyFailureCounter.inc({ dependency: 'boundary', reason });
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
      if (dependencyFailMode === 'error') {
        return res.status(503).json(failureResponse);
      }
      return res.status(200).json(failureResponse);
    }

    const violations = Array.isArray(boundaryResult.data?.violations)
      ? (boundaryResult.data?.violations as BoundaryViolation[])
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
        headers: { 'x-request-id': requestId },
      });
      if (ragResult.ok) {
        ragResponse = ragResult.data;
        break;
      }
    }

    const citations = Array.isArray(ragResponse?.citations)
      ? (ragResponse?.citations as RagCitation[])
      : [];
    const score = typeof ragResponse?.score === 'number'
      ? ragResponse.score
      : citations.length >= minEvidenceRequired
        ? 0.72
        : 0.35;

    const verdict = scoreToVerdict(score, citations.length, violations.length > 0);
    verdictCounter.inc({ verdict: verdict.verdict });

    const response: EthicsCheckResult = {
      ok: true,
      verdict: verdict.verdict,
      reason: verdict.reason,
      grounding: {
        score,
        citations,
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
      neededEvidence:
        verdict.verdict === 'green'
          ? []
          : ['mindestens zwei belastbare Quellen', 'konkreten Kontext für die Empfehlung'],
    };

    res.json(response);
  } catch (error) {
    console.error('[ethics-api] check failed', error);
    res.status(500).json({ ok: false, error: 'check_failed', detail: String((error as Error).message ?? error) });
  } finally {
    stopTimer();
  }
});

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
