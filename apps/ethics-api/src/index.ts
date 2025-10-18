import express from 'express';
import promClient from 'prom-client';

const app = express();
app.use(express.json({ limit: '1mb' }));

const offset = Number.parseInt(process.env.PORT_OFFSET ?? '0', 10) || 0;
const host = process.env.ETHICS_HOST || '127.0.0.1';
const port = Number.parseInt(process.env.ETHICS_PORT ?? '', 10) || 3110 + offset;

const boundaryPort = Number.parseInt(process.env.BOUNDARY_PORT ?? '', 10) || 4010 + offset;
const ragPort = Number.parseInt(process.env.RAG_API_PORT ?? '', 10) || 3003 + offset;

const registry = new promClient.Registry();
promClient.collectDefaultMetrics({ register: registry });

const verdictCounter = new promClient.Counter({
  name: 'ethics_verdict_total',
  help: 'Count of ethics verdicts grouped by colour',
  labelNames: ['verdict'],
  registers: [registry],
});

const durationHistogram = new promClient.Histogram({
  name: 'ethics_check_duration_ms',
  help: 'Runtime for ethics checks in milliseconds',
  buckets: [25, 50, 100, 250, 500, 1000, 2000, 4000],
  registers: [registry],
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'ethics-api', ts: new Date().toISOString() });
});

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', registry.contentType);
  res.end(await registry.metrics());
});

async function postJson(url: string, body: unknown) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn('[ethics-api] POST failed for %s: %s', url, error);
    return null;
  }
}

function parseNumber(value: unknown, fallback: number): number {
  const n = Number.parseFloat(String(value));
  if (Number.isFinite(n)) return n;
  return fallback;
}

function computeVerdict(score: number, evidenceCount: number, hasViolations: boolean) {
  const minGreen = Number.parseFloat(process.env.VERIFY_MIN_SCORE_GREEN ?? '0.7');
  const minYellow = Number.parseFloat(process.env.VERIFY_MIN_SCORE_YELLOW ?? '0.4');
  const minEvidence = Number.parseFloat(process.env.VERIFY_MIN_EVIDENCE ?? '2');

  if (hasViolations) return { verdict: 'red' as const, reason: 'boundary_violation' };
  if (score >= minGreen && evidenceCount >= minEvidence) {
    return { verdict: 'green' as const, reason: 'grounded' };
  }
  if (score >= minYellow) {
    return { verdict: 'yellow' as const, reason: 'needs_more_evidence' };
  }
  return { verdict: 'red' as const, reason: 'insufficient_grounding' };
}

app.post('/ethics/check', async (req, res) => {
  const endTimer = durationHistogram.startTimer();
  const { intent, content, context } = req.body ?? {};
  const narrative = String(content ?? intent ?? '').slice(0, 8000);

  const boundaryUrl = `http://127.0.0.1:${boundaryPort}/boundary/observe`;
  const ragUrlBase = `http://127.0.0.1:${ragPort}`;
  const ragPaths = ['/rag/ask', '/ask', '/query'];

  const boundary = await postJson(boundaryUrl, { text: narrative, context });
  const violations = Array.isArray(boundary?.violations) ? boundary.violations : [];

  let rag = null;
  for (const path of ragPaths) {
    rag = await postJson(`${ragUrlBase}${path}`, { question: intent, text: narrative });
    if (rag) break;
  }

  const citations = Array.isArray(rag?.citations) ? rag.citations : [];
  const evidenceCount = citations.length;
  const score = parseNumber(rag?.score, evidenceCount >= 2 ? 0.72 : 0.35);

  const verdict = computeVerdict(score, evidenceCount, violations.length > 0);
  verdictCounter.inc({ verdict: verdict.verdict });
  endTimer();

  const impact = {
    co2eKgMin: 0,
    co2eKgMax: 0,
    riskScore: violations.length > 0 ? 0.9 : 0.1,
  };

  res.json({
    ok: true,
    verdict: verdict.verdict,
    reason: verdict.reason,
    grounding: { score, citations },
    boundary: { count: violations.length, violations },
    impact,
    neededEvidence: verdict.verdict === 'green' ? [] : ['mindestens zwei belastbare Quellen'],
  });
});

app.post('/impact/report', (req, res) => {
  res.json({ ok: true, stored: true, payload: req.body ?? null });
});

app.post('/consent/issue', (req, res) => {
  const now = new Date().toISOString();
  const base = req.body ?? {};
  const ttlDays = Number.parseFloat(String(base.ttlDays ?? '30'));
  const receipt = {
    ...base,
    ttlDays: Number.isFinite(ttlDays) ? ttlDays : 30,
    issuedAt: now,
    signature: 'demo-signature',
  };
  res.json(receipt);
});

app.listen(port, host, () => {
  console.log(`[ethics-api] listening on http://${host}:${port}`);
  console.log(
    `[ethics-api] upstream boundary on ${boundaryPort}, rag on ${ragPort}, port offset ${offset}`,
  );
});

