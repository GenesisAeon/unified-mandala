#!/usr/bin/env node
// RAG smoke: index a small set and query

const BASE = process.env.PROXY_URL ?? 'http://127.0.0.1:4000';
const API_KEY = process.env.LOCAL_API_KEY;

function headers() {
  return {
    'content-type': 'application/json',
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
  };
}

async function main() {
  // Build a small index over docs
  const indexBody = {
    roots: ['repo://docs'],
    exts: ['.md'],
    max_depth: 2,
    limit: 50,
    chunk_chars: 600,
    chunk_overlap: 120,
  };
  const r1 = await fetch(`${BASE}/api/tools/rag/index`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(indexBody),
  });
  if (!r1.ok) throw new Error(`rag index HTTP ${r1.status}`);
  const j1 = await r1.json();
  if (!j1?.ok) throw new Error(`rag index failed: ${JSON.stringify(j1)}`);

  // Query
  const r2 = await fetch(`${BASE}/api/tools/rag/query`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ query: 'mandala', top_k: 3 }),
  });
  if (!r2.ok) throw new Error(`rag query HTTP ${r2.status}`);
  const j2 = await r2.json();
  if (!j2?.ok) throw new Error(`rag query failed: ${JSON.stringify(j2)}`);
  console.log(`rag smoke ok: ${j2.count} results`);
}

main().catch((e) => {
  console.error('rag smoke failed:', e?.message ?? e);
  process.exit(1);
});
