import express, { type Request, type Response } from 'express';
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from 'prom-client';
import { fetch } from 'undici';

type BoundaryViolation = Record<string, unknown> & { severity?: string; ruleId?: string };
interface BoundaryResponse {
  violations?: BoundaryViolation[];
}

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

interface EthicsCheckPayload {
  intent?: unknown;
  content?: unknown;
  context?: Record<string, unknown>;
  evidence?: string[];
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
}

const app = express();
app.use(express.json({ limit: '1mb' }));

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

function parseText(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (value === undefined || value === null) {
    return '';
  }
  return JSON.stringify(value);
}

async function safePostJson<T>(url: string, body: unknown): Promise<T | null> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.warn('[ethics-api] request failed', url, error);
    return null;
  }
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

app.post('/ethics/check', async (req: Request<unknown, unknown, EthicsCheckPayload>, res: Response) => {
  const stopTimer = checkDuration.startTimer();
  try {
    const { intent, content, context } = req.body ?? {};
    const minEvidenceRequired = Number.parseInt(process.env.VERIFY_MIN_EVIDENCE ?? '2', 10);
    const text = parseText(content ?? intent);

    const boundary = await safePostJson<BoundaryResponse>(`${boundaryUrl}/boundary/observe`, {
      text,
      context,
    });
    const violations = Array.isArray(boundary?.violations)
      ? (boundary?.violations as BoundaryViolation[])
      : [];

    const ragCandidates = ['/rag/ask', '/ask', '/query'];
    let ragResponse: RagResponse | null = null;
    for (const candidate of ragCandidates) {
      ragResponse = await safePostJson<RagResponse>(`${ragBaseUrl}${candidate}`, {
        question: parseText(intent),
        text,
      });
      if (ragResponse) {
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

app.listen(port, host, () => {
  console.log(`[ethics-api] listening on http://${host}:${port}`);
});
