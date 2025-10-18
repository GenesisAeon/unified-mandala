// Lightweight proxy that normalizes Ollama chat responses for the Mandala UI playground.
// Usage: QWEN_ENDPOINT=http://localhost:11434 QWEN_MODEL=qwen2.5:7b PORT=4000 node apps/api-lite/ollama-proxy.mjs

import express from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import rateLimit from 'express-rate-limit';

const upstream = (process.env.QWEN_ENDPOINT ?? 'http://localhost:11434').replace(/\/+$/, '');
const model = process.env.QWEN_MODEL ?? 'qwen2.5:7b';
const embedModel = process.env.EMBED_MODEL ?? 'nomic-embed-text';
const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? '127.0.0.1';

const app = express();
app.use(express.json({ limit: '256kb' }));

// --- Config: upstream request limits
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS ?? 120000); // 2 minutes
const DEFAULT_NUM_PREDICT = Number(process.env.NUM_PREDICT ?? 256);
const METRICS_PUBLIC = process.env.METRICS_PUBLIC === '1';

// ---- Mini Metrics ----------------------------------------------------------
function makeEmptyMetrics() {
  return {
    started_at: new Date().toISOString(),
    counters: { total: 0, '2xx': 0, '4xx': 0, '5xx': 0 },
    latency_ms: {
      count: 0,
      sum: 0,
      buckets: {
        '0-50': 0,
        '50-100': 0,
        '100-250': 0,
        '250-500': 0,
        '500-1000': 0,
        '1000-2000': 0,
        '2000-5000': 0,
        '5000+': 0,
      },
    },
    by_route: {},
  };
}

let METRICS = makeEmptyMetrics();

function bucketFor(ms) {
  if (ms < 50) return '0-50';
  if (ms < 100) return '50-100';
  if (ms < 250) return '100-250';
  if (ms < 500) return '250-500';
  if (ms < 1000) return '500-1000';
  if (ms < 2000) return '1000-2000';
  if (ms < 5000) return '2000-5000';
  return '5000+';
}

function ensureRoute(key) {
  if (!METRICS.by_route[key]) {
    METRICS.by_route[key] = {
      counters: { total: 0, '2xx': 0, '4xx': 0, '5xx': 0 },
      latency_ms: {
        count: 0,
        sum: 0,
        buckets: {
          '0-50': 0,
          '50-100': 0,
          '100-250': 0,
          '250-500': 0,
          '500-1000': 0,
          '1000-2000': 0,
          '2000-5000': 0,
          '5000+': 0,
        },
      },
    };
  }
  return METRICS.by_route[key];
}

function recordMetric(method, pathPrinted, ms, status) {
  const codeClass = status >= 500 ? '5xx' : status >= 400 ? '4xx' : '2xx';
  const b = bucketFor(ms);
  METRICS.counters.total += 1;
  METRICS.counters[codeClass] += 1;
  METRICS.latency_ms.count += 1;
  METRICS.latency_ms.sum += ms;
  METRICS.latency_ms.buckets[b] += 1;
  const key = `${method.toUpperCase()} ${pathPrinted}`;
  const R = ensureRoute(key);
  R.counters.total += 1;
  R.counters[codeClass] += 1;
  R.latency_ms.count += 1;
  R.latency_ms.sum += ms;
  R.latency_ms.buckets[b] += 1;
}

function resetMetrics() {
  METRICS = makeEmptyMetrics();
}

// Optional system primer for Qwen (loaded once from env/file)
let BASE_SYSTEM = process.env.QWEN_SYSTEM_PRIMER ?? '';
let primerLoaded = false;
async function loadPrimerIfNeeded() {
  if (primerLoaded) return;
  primerLoaded = true;
  try {
    const p = process.env.QWEN_PRIMER_FILE;
    if (p) {
      const abs = path.resolve(process.cwd(), p);
      BASE_SYSTEM = await fs.readFile(abs, 'utf8');
    }
  } catch {
    // ignore missing primer file
  }
}

// Optional API key guard
const requiredApiKey = process.env.LOCAL_API_KEY;
app.use((req, res, next) => {
  if (!requiredApiKey) return next();
  // Allow unauthenticated health/metrics so dev scripts can detect readiness (metrics only if opted public)
  if (
    req.path === '/health' ||
    req.path === '/api/ops/health' ||
    (METRICS_PUBLIC && req.path === '/metrics')
  )
    return next();
  const key = req.header('X-API-Key');
  if (key === requiredApiKey) return next();
  res.status(401).json({ error: 'unauthorized' });
});

// Lightweight audit log (method, path, status, duration ms) + metrics hook
app.use((req, res, next) => {
  const t0 = process.hrtime.bigint();
  res.on('finish', () => {
    const dtMs = Number((process.hrtime.bigint() - t0) / 1000000n);
    const ms = dtMs < 0 ? 0 : Math.round(dtMs);
    const pathPrinted = req.baseUrl + req.path;
    recordMetric(req.method, pathPrinted, ms, res.statusCode);
    console.log(`audit ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
});

// Health alias (UI sometimes calls /api/ops/health)
app.get(['/health', '/api/ops/health'], (_req, res) => {
  res.json({ ok: true, provider: 'ollama', model });
});

// CREP resonance stub to avoid noisy 404s
app.get('/api/crep/resonance', (_req, res) => {
  res.status(200).json({ ok: false, error: 'not_implemented', hint: 'stub' });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
  if (req.query?.reset === '1') resetMetrics();
  const avg = METRICS.latency_ms.count
    ? +(METRICS.latency_ms.sum / METRICS.latency_ms.count).toFixed(2)
    : 0;
  res.json({ ...METRICS, latency_ms: { ...METRICS.latency_ms, avg } });
});

function sanitizeOptions(input = {}) {
  const allowed = ['num_predict', 'temperature', 'top_k', 'top_p', 'stop'];
  const out = {};
  for (const k of allowed) {
    if (k in input) out[k] = input[k];
  }
  if (!('num_predict' in out)) out.num_predict = DEFAULT_NUM_PREDICT;
  return out;
}

function truncateMessages(msgs, maxChars = 8000) {
  if (!Array.isArray(msgs)) return [];
  const out = [];
  let total = 0;
  for (let i = msgs.length - 1; i >= 0; i--) {
    const m = msgs[i] || {};
    const text = String(m?.content ?? '');
    total += text.length;
    out.push(m);
    if (total >= maxChars) break;
  }
  return out.reverse();
}

async function handleChat(req, res) {
  const rid = Math.random().toString(36).slice(2, 10);
  try {
    await loadPrimerIfNeeded();
    const { messages = [], stream = false, options = {} } = req.body ?? {};
    const sys =
      BASE_SYSTEM && String(BASE_SYSTEM).trim().length
        ? [{ role: 'system', content: String(BASE_SYSTEM) }]
        : [];
    const upstreamMessages = truncateMessages([...sys, ...messages]);
    const safeOpts = sanitizeOptions(options);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const started = Date.now();
    const upstreamResponse = await fetch(`${upstream}/api/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ model, messages: upstreamMessages, stream, options: safeOpts }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));
    const dt = Date.now() - started;

    if (!upstreamResponse.ok) {
      const detail = await upstreamResponse.text();
      console.warn(
        `chat#${rid} upstream ${upstreamResponse.status} in ${dt}ms :: ${String(detail).slice(0, 200)}`,
      );
      res
        .status(502)
        .json({ error: 'ollama_upstream', rid, ms: dt, detail: String(detail).slice(0, 1000) });
      return;
    }

    const data = await upstreamResponse.json();
    const outputText = data?.message?.content ?? '';
    res.json({
      model: data.model ?? model,
      created_at: data.created_at,
      output_text: outputText,
      provider: 'qwen-ollama',
      meta: {
        done: data.done,
        total_duration: data.total_duration,
        eval_count: data.eval_count,
        prompt_eval_count: data.prompt_eval_count,
        rid,
        ms: dt,
        options: safeOpts,
      },
    });
  } catch (error) {
    const name = String(error?.name ?? error).toLowerCase();
    const isAbort = name.includes('abort');
    const code = isAbort ? 504 : 500;
    console.error(
      `chat#${Math.random().toString(36).slice(2, 6)} ${isAbort ? 'timeout' : 'proxy_crash'} ::`,
      error,
    );
    res.status(code).json({
      error: isAbort ? 'upstream_timeout' : 'proxy_crash',
      detail: String(error?.message ?? error),
    });
  }
}

// Backward-compatible route alias
// Apply rate limits for chat endpoints
const chatLimiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});
app.post('/api/chat', chatLimiter, handleChat);
app.post('/api/ai/chat', chatLimiter, handleChat);

// Guarded FS tool routes (Two-Plane-Guard: repo/scratch/data)
const repoRoot = process.env.REPO_ROOT ?? path.resolve(process.cwd());
const scratchRoot = process.env.SCRATCH_ROOT ?? path.resolve(process.cwd(), '.ai-scratch');
const dataRoot = process.env.DATA_ROOT ?? path.resolve(process.cwd(), '..', 'data');
const pcRoot = process.env.PC_ROOT; // optional broad read-only root for local testing (e.g., D:\)

const ROOTS = {
  'repo://': repoRoot,
  'scratch://': scratchRoot,
  'data://': dataRoot,
  ...(pcRoot ? { 'pc://': pcRoot } : {}),
};

function resolveUri(uri) {
  if (typeof uri !== 'string' || !uri.includes('://')) {
    throw new Error('unsupported_uri');
  }
  const scheme = Object.keys(ROOTS).find((s) => uri.startsWith(s));
  if (!scheme) throw new Error('unsupported_uri_scheme');
  const rel = uri.slice(scheme.length).replace(/^\/+/, '');
  const base = ROOTS[scheme];
  const abs = path.resolve(base, rel);
  const baseResolved = path.resolve(base);
  if (!abs.startsWith(baseResolved)) throw new Error('path_traversal');
  return { scheme, abs };
}

const fsLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/tools/fs/read', fsLimiter, async (req, res) => {
  try {
    const { uri, encoding = 'utf8' } = req.body ?? {};
    const { abs } = resolveUri(uri);
    const data = await fs.readFile(abs, encoding === 'base64' ? null : encoding);
    const content = encoding === 'base64' ? Buffer.from(data).toString('base64') : data;
    res.json({ uri, encoding, content });
  } catch (e) {
    res.status(400).json({ error: 'fs_read_failed', detail: String(e?.message ?? e) });
  }
});

app.post('/api/tools/fs/write', fsLimiter, async (req, res) => {
  try {
    const { uri, content, encoding = 'utf8' } = req.body ?? {};
    const { scheme, abs } = resolveUri(uri);
    if (scheme === 'repo://') return res.status(403).json({ error: 'repo_read_only' });
    await fs.mkdir(path.dirname(abs), { recursive: true });
    const buf = encoding === 'base64' ? Buffer.from(content ?? '', 'base64') : (content ?? '');
    await fs.writeFile(abs, buf);
    res.json({ uri, ok: true });
  } catch (e) {
    res.status(400).json({ error: 'fs_write_failed', detail: String(e?.message ?? e) });
  }
});

// --- FS: Directory listing (recursive with depth/limit and extension filter)
async function listRecursive(
  dirAbs,
  { exts = [], max_depth = 2, limit = 200 },
  acc = [],
  depth = 0,
) {
  if (acc.length >= limit) return acc;
  const entries = await fs.readdir(dirAbs, { withFileTypes: true });
  for (const e of entries) {
    if (acc.length >= limit) break;
    const p = path.join(dirAbs, e.name);
    if (e.isDirectory()) {
      if (depth < max_depth) {
        await listRecursive(p, { exts, max_depth, limit }, acc, depth + 1);
      }
    } else {
      if (
        !exts?.length ||
        exts.some((x) => e.name.toLowerCase().endsWith(String(x).toLowerCase()))
      ) {
        acc.push(p);
      }
    }
  }
  return acc;
}

app.post('/api/tools/fs/list', fsLimiter, async (req, res) => {
  try {
    const {
      uri,
      exts = ['.md', '.json', '.yaml', '.yml'],
      max_depth = 2,
      limit = 200,
    } = req.body ?? {};
    const { abs } = resolveUri(uri);
    const st = await fs.stat(abs);
    if (!st.isDirectory()) return res.status(400).json({ error: 'not_a_directory' });
    const files = await listRecursive(abs, { exts, max_depth, limit });
    const items = files
      .map((absPath) => {
        const absResolved = path.resolve(absPath);
        for (const [scheme, base] of Object.entries(ROOTS)) {
          const baseResolved = path.resolve(base);
          if (absResolved.startsWith(baseResolved)) {
            const rel = absResolved.slice(baseResolved.length).replace(/^[\\/]+/, '');
            return `${scheme}${rel.replace(/\\/g, '/')}`;
          }
        }
        return null;
      })
      .filter(Boolean);
    res.json({ uri, count: items.length, items });
  } catch (e) {
    res.status(400).json({ error: 'fs_list_failed', detail: String(e?.message ?? e) });
  }
});

// --- Local Memory (JSONL) ---
const memoryFile = path.join(dataRoot, 'memory', 'notes.jsonl');

function tokenize(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9äöüß\- ]+/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function scoreNote(note, qTokens) {
  const t = tokenize(`${note?.text ?? ''} ${(note?.tags ?? []).join(' ')}`);
  let score = 0;
  for (const qt of qTokens) {
    score += t.filter((w) => w === qt).length * 3; // exact
    score += t.filter((w) => w.includes(qt)).length; // partial
  }
  score += Math.min(3, Array.isArray(note?.tags) ? note.tags.length : 0);
  return score;
}

app.post('/api/tools/memory/remember', async (req, res) => {
  try {
    const { text, tags = [], user = 'user' } = req.body ?? {};
    if (!text || typeof text !== 'string') return res.status(400).json({ error: 'text_required' });
    await fs.mkdir(path.dirname(memoryFile), { recursive: true });
    const rec = { ts: new Date().toISOString(), user, tags, text };
    await fs.appendFile(memoryFile, JSON.stringify(rec) + '\n', 'utf8');
    res.json({ ok: true, stored: rec });
  } catch (e) {
    res.status(400).json({ error: 'memory_remember_failed', detail: String(e?.message ?? e) });
  }
});

app.post('/api/tools/memory/recall', async (req, res) => {
  try {
    const { query = '', top_k = 10 } = req.body ?? {};
    const qTokens = tokenize(query);
    let raw = '';
    try {
      raw = await fs.readFile(memoryFile, 'utf8');
    } catch {}
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const notes = lines
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    const ranked = qTokens.length
      ? notes.map((n) => ({ n, s: scoreNote(n, qTokens) })).sort((a, b) => b.s - a.s)
      : notes.map((n) => ({ n, s: 0 })).reverse();
    res.json({
      ok: true,
      count: Math.min(top_k, ranked.length),
      items: ranked.slice(0, top_k).map((x) => x.n),
    });
  } catch (e) {
    res.status(400).json({ error: 'memory_recall_failed', detail: String(e?.message ?? e) });
  }
});

// --- RAG: indexing and querying (Embeddings via Ollama) ---
const ragDir = path.join(dataRoot, 'rag');
const ragIndexFile = path.join(ragDir, 'index.jsonl');

function chunkText(text, chunkChars = 800, overlap = 160) {
  const out = [];
  const t = String(text ?? '');
  if (!t) return out;
  let i = 0;
  while (i < t.length) {
    const end = Math.min(t.length, i + chunkChars);
    out.push(t.slice(i, end));
    if (end >= t.length) break;
    i = Math.max(i + chunkChars - overlap, i + 1);
  }
  return out;
}

async function embedOne(prompt) {
  const r = await fetch(`${upstream}/api/embeddings`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model: embedModel, prompt: String(prompt ?? '') }),
  });
  if (!r.ok) {
    const d = await r.text();
    throw new Error(`embed_http_${r.status}: ${d?.slice?.(0, 200)}`);
  }
  const j = await r.json();
  // Ollama returns { embedding: number[] }
  const vec = j?.embedding || j?.data?.[0]?.embedding;
  if (!Array.isArray(vec)) throw new Error('embed_no_vector');
  return vec;
}

async function embedReady() {
  try {
    await embedOne(' ');
    return true;
  } catch {
    return false;
  }
}

app.post('/api/tools/rag/index', fsLimiter, async (req, res) => {
  try {
    const {
      roots = ['repo://docs'],
      exts = ['.md', '.txt'],
      max_depth = 3,
      limit = 500,
      chunk_chars = 800,
      chunk_overlap = 160,
      fresh = true,
    } = req.body ?? {};

    // Collect files from roots
    const files = [];
    for (const root of roots) {
      const { abs } = resolveUri(root);
      const st = await fs.stat(abs);
      if (!st.isDirectory()) continue;
      const listed = await listRecursive(abs, { exts, max_depth, limit });
      files.push(...listed);
    }

    await fs.mkdir(ragDir, { recursive: true });
    // Truncate existing index only on fresh builds
    if (fresh) {
      await fs.writeFile(ragIndexFile, '');
    }

    let countChunks = 0;
    for (const absPath of files) {
      // Map back to namespaced uri
      let uri = null;
      const absResolved = path.resolve(absPath);
      for (const [scheme, base] of Object.entries(ROOTS)) {
        const baseResolved = path.resolve(base);
        if (absResolved.startsWith(baseResolved)) {
          const rel = absResolved.slice(baseResolved.length).replace(/^[\\/]+/, '');
          uri = `${scheme}${rel.replace(/\\/g, '/')}`;
          break;
        }
      }
      if (!uri) continue;

      const content = await fs.readFile(absPath, 'utf8').catch(() => '');
      if (!content) continue;
      const chunks = chunkText(content, chunk_chars, chunk_overlap);
      let idx = 0;
      for (const ch of chunks) {
        const vec = await embedOne(ch);
        const rec = { uri, chunk_index: idx++, text: ch, embedding: vec };
        await fs.appendFile(ragIndexFile, JSON.stringify(rec) + '\n', 'utf8');
        countChunks += 1;
        if (countChunks >= limit) break;
      }
      if (countChunks >= limit) break;
    }

    res.json({ ok: true, files: files.length, chunks: countChunks, embed_model: embedModel });
  } catch (e) {
    res.status(400).json({ error: 'rag_index_failed', detail: String(e?.message ?? e) });
  }
});

function cosine(a, b) {
  let dot = 0,
    na = 0,
    nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const x = a[i];
    const y = b[i];
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

app.post('/api/tools/rag/query', async (req, res) => {
  try {
    const { query, top_k = 5 } = req.body ?? {};
    if (!query) return res.status(400).json({ error: 'query_required' });
    let raw = '';
    try {
      raw = await fs.readFile(ragIndexFile, 'utf8');
    } catch {
      return res.status(404).json({ error: 'rag_index_missing' });
    }
    const qvec = await embedOne(query);
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const items = [];
    for (const l of lines) {
      try {
        const rec = JSON.parse(l);
        if (Array.isArray(rec?.embedding)) {
          const sim = cosine(qvec, rec.embedding);
          items.push({ ...rec, score: sim });
        }
      } catch {}
    }
    items.sort((a, b) => b.score - a.score);
    res.json({ ok: true, count: Math.min(top_k, items.length), items: items.slice(0, top_k) });
  } catch (e) {
    res.status(400).json({ error: 'rag_query_failed', detail: String(e?.message ?? e) });
  }
});

app.listen(port, host, () => {
  console.log(`[ollama-proxy] http://${host}:${port} --> ${upstream} (${model})`);
});

embedReady()
  .then((ready) => {
    if (!ready) {
      console.warn(
        `[ollama-proxy] Embed model "${embedModel}" not ready yet – embedding endpoints may return errors until warmed up.`,
      );
    }
  })
  .catch((error) => {
    console.warn('[ollama-proxy] Failed to probe embed model readiness:', error);
  });
