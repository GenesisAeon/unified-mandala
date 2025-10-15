#!/usr/bin/env tsx
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import {
  readFileSync,
  readdirSync,
  statSync,
  mkdirSync,
  writeFileSync,
  existsSync,
  appendFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';

const PORT = Number(process.env.BOUNDARY_PORT || 4010);
const HOST = process.env.BOUNDARY_HOST || '127.0.0.1';
const ROOT = resolve(process.cwd(), 'data', 'logs', 'boundary');
const NATS_URL = process.env.NATS_URL || process.env.NATS_SERVERS || '';

type Law = {
  ts: string;
  source: string;
  ruleId: string;
  verdict: 'pass' | 'violation';
  details?: string;
  severity?: 'ok' | 'warn' | 'error';
};

type Snapshot = {
  generated_at: string;
  rules_count: number;
  observations_count: number;
  violations_count: number;
  summary: { ok: number; warn: number; error: number };
  laws: Law[];
};

// Optional Prometheus metrics (lazy-loaded)
let prom: any = null;
let reg: any = null;
let obsHist: any = null;
let lawsCounter: any = null;

async function ensureMetrics() {
  if (prom) return;
  try {
    // @ts-ignore
    prom = await import('prom-client');
    reg = new prom.Registry();
    prom.collectDefaultMetrics({ register: reg });
    obsHist = new prom.Histogram({
      name: 'boundary_observe_latency_ms',
      help: 'Latency of /boundary/observe in milliseconds',
      buckets: [5, 10, 50, 100, 250, 500, 1000, 2000],
      registers: [reg],
    });
    lawsCounter = new prom.Counter({
      name: 'boundary_laws_accepted_total',
      help: 'Total accepted laws',
      registers: [reg],
    });
  } catch {
    // prom-client not available; /metrics will respond 503
  }
}

function ensureDir() {
  if (!existsSync(ROOT)) mkdirSync(ROOT, { recursive: true });
}

function latestLawsPath(): string | null {
  ensureDir();
  const files = readdirSync(ROOT).filter((f) => /^laws.*\.json$/i.test(f));
  if (!files.length) return null;
  files.sort((a, b) => statSync(join(ROOT, a)).mtimeMs - statSync(join(ROOT, b)).mtimeMs);
  return join(ROOT, files[files.length - 1]);
}

function pickLatest(): Snapshot | null {
  const p = latestLawsPath();
  if (!p) return null;
  try {
    const text = readFileSync(p, 'utf8');
    return JSON.parse(text) as Snapshot;
  } catch {
    return null;
  }
}

async function maybePublishNats(laws: Law[]) {
  if (!NATS_URL) return;
  try {
    // lazy import; if not installed, just skip
    // @ts-ignore
    const { connect } = await import('nats');
    const servers = NATS_URL.split(/,\s+/).filter(Boolean);
    const nc = await connect({ servers });
    const subj = 'boundary.law.discovered';
    for (const law of laws) {
      nc.publish(subj, Buffer.from(JSON.stringify(law)));
    }
    await nc.flush();
    await nc.close();
  } catch {
    // ignore if nats not available
  }
}

function sendJson(res: ServerResponse, code: number, body: any) {
  const text = JSON.stringify(body);
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(text),
  });
  res.end(text);
}

createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const method = req.method || 'GET';
  const url = req.url || '/';

  if (method === 'GET' && url === '/metrics') {
    ensureMetrics().then(async () => {
      if (!reg) {
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        return void res.end('# metrics unavailable (prom-client not installed)');
      }
      const text = await reg.metrics();
      res.writeHead(200, { 'Content-Type': reg.contentType });
      return void res.end(text);
    });
    return;
  }

  if (method === 'GET' && (url === '/health' || url === '/boundary/health')) {
    return sendJson(res, 200, { ok: true, service: 'boundary', ts: new Date().toISOString() });
  }

  if (method === 'GET' && (url === '/boundary/laws' || url.startsWith('/boundary/laws?'))) {
    const payload = pickLatest();
    if (!payload) return sendJson(res, 404, { error: 'no_snapshot' });
    return sendJson(res, 200, payload);
  }

  if (method === 'POST' && url === '/boundary/observe') {
    const start = Date.now();
    let buf = '';
    req.on('data', (c: any) => (buf += c));
    req.on('end', async () => {
      try {
        const body = buf ? JSON.parse(buf) : {};
        let laws: Law[] = [];
        if (Array.isArray(body?.laws)) laws = body.laws as Law[];
        else if (Array.isArray(body?.law)) laws = body.law as Law[];
        else if (body?.law) laws = [body.law as Law];

        if (!Array.isArray(laws) || laws.length === 0)
          return sendJson(res, 400, { error: 'no_laws' });

        ensureDir();
        const jsonl = join(ROOT, 'laws.jsonl');
        for (const l of laws) appendFileSync(jsonl, JSON.stringify(l) + '\n');

        // naive rollup: keep last 500 lines
        try {
          const lines = readFileSync(jsonl, 'utf8').trim().split('\n').slice(-500);
          writeFileSync(jsonl, lines.join('\n') + '\n');
        } catch {}

        // write a snapshot too
        const snap: Snapshot = {
          generated_at: new Date().toISOString(),
          rules_count: 0,
          observations_count: laws.length,
          violations_count: laws.filter((l) => l.verdict === 'violation').length,
          summary: {
            ok: laws.filter((l) => l.severity === 'ok').length,
            warn: laws.filter((l) => l.severity === 'warn').length,
            error: laws.filter((l) => l.severity === 'error').length,
          },
          laws,
        };
        writeFileSync(join(ROOT, 'laws.json'), JSON.stringify(snap, null, 2));

        await maybePublishNats(laws);

        // metrics
        await ensureMetrics();
        try {
          lawsCounter?.inc(laws.length);
          obsHist?.observe(Date.now() - start);
        } catch {}
        return sendJson(res, 202, { accepted: laws.length });
      } catch (e: any) {
        return sendJson(res, 400, { error: 'bad_json', detail: e?.message });
      }
    });
    return;
  }

  sendJson(res, 404, { error: 'not_found' });
})
  .listen(PORT, HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`boundary listening on http://${HOST}:${PORT}`);
  })
  .on('error', (e) => {
    // eslint-disable-next-line no-console
    console.error('boundary server error', e);
    process.exit(1);
  });
