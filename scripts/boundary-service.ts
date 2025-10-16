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
  unlinkSync,
} from 'node:fs';
import { writeFile, rename } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import {
  isValidBoundaryEventKey,
  stableBoundaryEventKey,
} from '../packages/boundary-core/src/event-key.js';

const PORT = Number(process.env.BOUNDARY_PORT || 4010);
const HOST = process.env.BOUNDARY_HOST || '127.0.0.1';
const ROOT = resolve(process.cwd(), 'data', 'logs', 'boundary');
const NATS_URL = process.env.NATS_URL || process.env.NATS_SERVERS || '';

type Law = {
  ts: string;
  source: string;
  ruleId: string;
  verdict: 'pass' | 'violation';
  eventKey: string;
  details?: string;
  severity?: 'ok' | 'warn' | 'error';
  payload?: unknown;
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
let dedupedCounter: any = null;
let dedupeGauge: any = null;
let responsesCounter: any = null;
let responseFamilyCounter: any = null;
let snapshotErrorCounter: any = null;
let observeResultCounter: any = null;
let idempotencyMissingCounter: any = null;

const DEDUPE_TTL_MS = Number(process.env.BOUNDARY_DEDUPE_TTL_MS ?? 6 * 60 * 60 * 1000);
const DEDUPE_MAX = Number(process.env.BOUNDARY_DEDUPE_MAX ?? 50_000);
const dedupeStore = new Map<string, number>();
const JSONL_PATH = join(ROOT, 'laws.jsonl');
const STATUS_PATH = join(ROOT, 'status.json');
const DEDUPE_WARM_LIMIT = Number(process.env.BOUNDARY_WARM_CACHE_LIMIT ?? 200);
const DEDUPE_HIT_WINDOW_MS = 60_000;

const CORS_ALLOW_ORIGIN = process.env.BOUNDARY_CORS_ALLOW_ORIGIN ?? '*';
const CORS_ALLOW_HEADERS =
  process.env.BOUNDARY_CORS_ALLOW_HEADERS ?? 'Content-Type, Idempotency-Key';
const CORS_ALLOW_METHODS = process.env.BOUNDARY_CORS_ALLOW_METHODS ?? 'GET,POST,OPTIONS';
const CORS_EXPOSE_HEADERS = process.env.BOUNDARY_CORS_EXPOSE_HEADERS ?? 'Idempotency-Key';
const CORS_MAX_AGE = process.env.BOUNDARY_CORS_MAX_AGE ?? '300';

let dedupeHitsTotal = 0;
const dedupeHitsWindow: number[] = [];
let lastDuplicateAt: string | null = null;
let lastAcceptedAt: string | null = null;
let snapshotErrorsTotal = 0;

function updateDedupeGauge() {
  if (dedupeGauge) dedupeGauge.set(dedupeStore.size);
}

function pruneExpired(now: number) {
  for (const [key, expiresAt] of dedupeStore) {
    if (expiresAt <= now) {
      dedupeStore.delete(key);
    }
  }
  updateDedupeGauge();
}

function dedupeHas(key: string): boolean {
  const now = Date.now();
  pruneExpired(now);
  const exp = dedupeStore.get(key);
  if (!exp) return false;
  if (exp <= now) {
    dedupeStore.delete(key);
    updateDedupeGauge();
    return false;
  }
  return true;
}

function dedupePut(key: string) {
  pruneExpired(Date.now());
  if (dedupeStore.size >= DEDUPE_MAX) {
    const first = dedupeStore.keys().next().value;
    if (first) dedupeStore.delete(first);
  }
  dedupeStore.set(key, Date.now() + DEDUPE_TTL_MS);
  updateDedupeGauge();
}

function trimDedupeWindow(now = Date.now()) {
  const cutoff = now - DEDUPE_HIT_WINDOW_MS;
  while (dedupeHitsWindow.length && dedupeHitsWindow[0] < cutoff) {
    dedupeHitsWindow.shift();
  }
}

function recordDedupeHit(count = 1) {
  const now = Date.now();
  trimDedupeWindow(now);
  for (let i = 0; i < count; i += 1) {
    dedupeHitsWindow.push(now);
  }
  dedupeHitsTotal += count;
}

function dedupesPerMinute(now = Date.now()): number {
  trimDedupeWindow(now);
  return dedupeHitsWindow.length;
}

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
    dedupedCounter = new prom.Counter({
      name: 'boundary_law_deduped_total',
      help: 'Total deduped boundary events',
      registers: [reg],
    });
    dedupeGauge = new prom.Gauge({
      name: 'boundary_dedupe_store_size',
      help: 'Keys stored in boundary dedupe cache',
      registers: [reg],
    });
    responsesCounter = new prom.Counter({
      name: 'boundary_http_responses_total',
      help: 'HTTP responses grouped by status code',
      labelNames: ['code'],
      registers: [reg],
    });
    responseFamilyCounter = new prom.Counter({
      name: 'boundary_http_response_family_total',
      help: 'HTTP responses grouped by status family (2xx,4xx,5xx)',
      labelNames: ['family'],
      registers: [reg],
    });
    snapshotErrorCounter = new prom.Counter({
      name: 'boundary_snapshot_write_errors_total',
      help: 'Count of snapshot write failures',
      registers: [reg],
    });
    observeResultCounter = new prom.Counter({
      name: 'boundary_observe_total',
      help: 'Count of /boundary/observe results grouped by outcome',
      labelNames: ['result'],
      registers: [reg],
    });
    idempotencyMissingCounter = new prom.Counter({
      name: 'boundary_idempotency_missing_total',
      help: 'Count of observe requests missing Idempotency-Key header',
      registers: [reg],
    });
    updateDedupeGauge();
  } catch {
    // prom-client not available; /metrics will respond 503
  }
}

function recordResponse(code: number) {
  try {
    responsesCounter?.inc({ code: String(code) });
    const family = `${Math.floor(code / 100)}xx`;
    responseFamilyCounter?.inc({ family });
  } catch {}
}

function recordSnapshotError() {
  try {
    snapshotErrorCounter?.inc();
  } catch {}
  snapshotErrorsTotal += 1;
}

function normalizeHeaderValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value.find((entry) => typeof entry === 'string' && entry.trim().length > 0) ?? null;
  }
  if (typeof value === 'string' && value.trim().length > 0) return value;
  return null;
}

function readIdempotencyKey(req: IncomingMessage): string | null {
  return (
    normalizeHeaderValue(req.headers['idempotency-key']) ??
    normalizeHeaderValue(req.headers['x-idempotency-key']) ??
    null
  );
}

function getStatusSnapshot(now = Date.now()) {
  return {
    generated_at: new Date(now).toISOString(),
    dedupe_store_size: dedupeStore.size,
    dedupe_store_max: DEDUPE_MAX,
    dedupe_ttl_ms: DEDUPE_TTL_MS,
    dedupes_per_minute: dedupesPerMinute(now),
    dedupe_hits_total: dedupeHitsTotal,
    last_duplicate_at: lastDuplicateAt,
    last_accepted_at: lastAcceptedAt,
    snapshot_errors_total: snapshotErrorsTotal,
  };
}

function updateStatusFile() {
  try {
    ensureDir();
    writeFileSync(STATUS_PATH, JSON.stringify(getStatusSnapshot(), null, 2));
  } catch {}
}

function cleanupTmpSnapshot() {
  const tmp = join(ROOT, 'laws.json.tmp');
  try {
    if (existsSync(tmp)) unlinkSync(tmp);
  } catch {}
}

function warmDedupeFromJsonl(limit = DEDUPE_WARM_LIMIT) {
  if (!limit || limit <= 0) return;
  try {
    const raw = readFileSync(JSONL_PATH, 'utf8');
    const trimmed = raw.trim();
    if (!trimmed) return;
    const lines = trimmed.split('\n').slice(-limit);
    const now = Date.now();
    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        const key = parsed?.eventKey;
        if (isValidBoundaryEventKey(key)) {
          if (dedupeStore.size >= DEDUPE_MAX) break;
          dedupeStore.set(key, now + DEDUPE_TTL_MS);
        }
      } catch {}
    }
    updateDedupeGauge();
  } catch {}
}

function bootstrap() {
  ensureDir();
  cleanupTmpSnapshot();
  warmDedupeFromJsonl();
  pruneExpired(Date.now());
  updateStatusFile();
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

function sendJson(
  res: ServerResponse,
  code: number,
  body: any,
  extraHeaders: Record<string, string> = {},
) {
  const payload = body ?? {};
  const text = JSON.stringify(payload);
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': CORS_ALLOW_ORIGIN,
    'Access-Control-Allow-Headers': CORS_ALLOW_HEADERS,
    'Access-Control-Allow-Methods': CORS_ALLOW_METHODS,
    'Access-Control-Expose-Headers': CORS_EXPOSE_HEADERS,
    'Content-Length': Buffer.byteLength(text),
    ...extraHeaders,
  });
  recordResponse(code);
  res.end(text);
}

async function writeSnapshot(snapshot: Snapshot) {
  const target = join(ROOT, 'laws.json');
  const tmp = `${target}.tmp`;
  await writeFile(tmp, JSON.stringify(snapshot, null, 2));
  await rename(tmp, target);
}

bootstrap();

createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const method = req.method || 'GET';
  const url = req.url || '/';

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': CORS_ALLOW_ORIGIN,
      'Access-Control-Allow-Headers': CORS_ALLOW_HEADERS,
      'Access-Control-Allow-Methods': CORS_ALLOW_METHODS,
      'Access-Control-Expose-Headers': CORS_EXPOSE_HEADERS,
      'Access-Control-Max-Age': CORS_MAX_AGE,
      'Content-Length': 0,
    });
    recordResponse(204);
    res.end();
    return;
  }

  if (method === 'GET' && url === '/metrics') {
    ensureMetrics().then(async () => {
      if (!reg) {
        res.writeHead(503, { 'Content-Type': 'text/plain' });
        recordResponse(503);
        return void res.end('# metrics unavailable (prom-client not installed)');
      }
      const text = await reg.metrics();
      res.writeHead(200, { 'Content-Type': reg.contentType });
      recordResponse(200);
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

  if (method === 'GET' && url === '/boundary/status') {
    return sendJson(res, 200, getStatusSnapshot());
  }

  if (method === 'POST' && url === '/boundary/observe') {
    const start = Date.now();
    let buf = '';
    req.on('data', (c: any) => (buf += c));
    req.on('end', async () => {
      const headerKeyRaw = readIdempotencyKey(req);
      await ensureMetrics();
      if (!headerKeyRaw) {
        try {
          idempotencyMissingCounter?.inc();
        } catch {}
      }
      try {
        const body = buf ? JSON.parse(buf) : {};
        let laws: Law[] = [];
        if (Array.isArray(body?.laws)) laws = body.laws as Law[];
        else if (Array.isArray(body?.law)) laws = body.law as Law[];
        else if (body?.law) laws = [body.law as Law];

        if (!Array.isArray(laws) || laws.length === 0) {
          try {
            observeResultCounter?.inc({ result: 'invalid' });
          } catch {}
          return sendJson(
            res,
            400,
            { error: 'no_laws' },
            headerKeyRaw ? { 'Idempotency-Key': headerKeyRaw } : undefined,
          );
        }

        if (headerKeyRaw && !isValidBoundaryEventKey(headerKeyRaw)) {
          try {
            observeResultCounter?.inc({ result: 'invalid' });
          } catch {}
          return sendJson(
            res,
            400,
            { error: 'invalid_idempotency_key', idempotencyKey: headerKeyRaw },
            { 'Idempotency-Key': headerKeyRaw },
          );
        }

        const headerKey = headerKeyRaw && laws.length === 1 ? headerKeyRaw : null;
        if (headerKeyRaw && laws.length !== 1) {
          try {
            observeResultCounter?.inc({ result: 'invalid' });
          } catch {}
          return sendJson(
            res,
            400,
            {
              error: 'idempotency_key_requires_single_law',
              count: laws.length,
              idempotencyKey: headerKeyRaw,
            },
            { 'Idempotency-Key': headerKeyRaw },
          );
        }

        const canonicalLaws = laws.map((lawInput) => {
          const eventKey =
            headerKey ??
            stableBoundaryEventKey({
              ruleId: (lawInput as any)?.ruleId,
              source: (lawInput as any)?.source,
              ts: (lawInput as any)?.ts,
              verdict: (lawInput as any)?.verdict,
              severity: (lawInput as any)?.severity,
              payload: (lawInput as any)?.payload,
              details: (lawInput as any)?.details,
            });
          return { ...lawInput, eventKey } as Law;
        });

        const duplicates = canonicalLaws.filter((l) => dedupeHas(l.eventKey));
        if (duplicates.length) {
          try {
            dedupedCounter?.inc(duplicates.length);
          } catch {}
          recordDedupeHit(duplicates.length);
          lastDuplicateAt = new Date().toISOString();
          updateStatusFile();
          const responseKey =
            headerKey ?? (duplicates.length === 1 ? duplicates[0].eventKey : null);
          const duplicatePayload: any = {
            error: 'duplicate_eventKey',
            count: duplicates.length,
            eventKeys: duplicates.map((l) => l.eventKey),
          };
          if (responseKey) duplicatePayload.idempotencyKey = responseKey;
          try {
            observeResultCounter?.inc({ result: 'duplicate' });
          } catch {}
          return sendJson(
            res,
            409,
            duplicatePayload,
            responseKey ? { 'Idempotency-Key': responseKey } : undefined,
          );
        }

        for (const law of canonicalLaws) dedupePut(law.eventKey);

        ensureDir();
        for (const l of canonicalLaws) appendFileSync(JSONL_PATH, JSON.stringify(l) + '\n');

        // naive rollup: keep last 500 lines
        try {
          const lines = readFileSync(JSONL_PATH, 'utf8').trim().split('\n').slice(-500);
          writeFileSync(JSONL_PATH, lines.join('\n') + '\n');
        } catch {}

        // write a snapshot too
        const snap: Snapshot = {
          generated_at: new Date().toISOString(),
          rules_count: 0,
          observations_count: canonicalLaws.length,
          violations_count: canonicalLaws.filter((l) => l.verdict === 'violation').length,
          summary: {
            ok: canonicalLaws.filter((l) => l.severity === 'ok').length,
            warn: canonicalLaws.filter((l) => l.severity === 'warn').length,
            error: canonicalLaws.filter((l) => l.severity === 'error').length,
          },
          laws: canonicalLaws,
        };
        try {
          await writeSnapshot(snap);
        } catch (err: any) {
          recordSnapshotError();
          updateStatusFile();
          const responseKey =
            headerKey ?? (canonicalLaws.length === 1 ? canonicalLaws[0].eventKey : null);
          const payload: any = { error: 'snapshot_write_failed', detail: err?.message };
          if (responseKey) payload.idempotencyKey = responseKey;
          try {
            observeResultCounter?.inc({ result: 'error' });
          } catch {}
          return sendJson(
            res,
            500,
            payload,
            responseKey ? { 'Idempotency-Key': responseKey } : undefined,
          );
        }

        await maybePublishNats(canonicalLaws);

        // metrics
        try {
          lawsCounter?.inc(canonicalLaws.length);
          obsHist?.observe(Date.now() - start);
        } catch {}
        lastAcceptedAt = new Date().toISOString();
        updateStatusFile();
        const responseKey =
          headerKey ?? (canonicalLaws.length === 1 ? canonicalLaws[0].eventKey : null);
        const acceptedPayload: any = { accepted: canonicalLaws.length };
        if (responseKey) acceptedPayload.idempotencyKey = responseKey;
        try {
          observeResultCounter?.inc({ result: 'accepted' });
        } catch {}
        return sendJson(
          res,
          202,
          acceptedPayload,
          responseKey ? { 'Idempotency-Key': responseKey } : undefined,
        );
      } catch (e: any) {
        try {
          observeResultCounter?.inc({ result: 'invalid' });
        } catch {}
        return sendJson(
          res,
          400,
          { error: 'bad_json', detail: e?.message },
          headerKeyRaw ? { 'Idempotency-Key': headerKeyRaw } : undefined,
        );
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
