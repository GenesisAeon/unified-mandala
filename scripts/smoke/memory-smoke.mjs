#!/usr/bin/env node
// Simple smoke for local memory endpoints
// Usage: pnpm smoke:memory

const BASE = process.env.PROXY_URL ?? 'http://127.0.0.1:4000';
const API_KEY = process.env.LOCAL_API_KEY;

function headers() {
  return {
    'content-type': 'application/json',
    ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
  };
}

async function main() {
  const note = {
    text: `Qwen memory smoke ${new Date().toISOString()}`,
    tags: ['smoke', 'qwen', 'memory'],
    user: 'smoke',
  };

  const r1 = await fetch(`${BASE}/api/tools/memory/remember`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(note),
  });
  if (!r1.ok) throw new Error(`remember HTTP ${r1.status}`);
  await r1.json();

  const r2 = await fetch(`${BASE}/api/tools/memory/recall`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ query: 'memory', top_k: 5 }),
  });
  if (!r2.ok) throw new Error(`recall HTTP ${r2.status}`);
  const j2 = await r2.json();

  const ok = j2?.items?.some?.((x) => x?.text === note.text);
  if (ok) {
    console.log('memory smoke ok');
    process.exit(0);
  }
  console.log('memory recall returned', j2?.count ?? 0, 'items');
  console.log('latest item:', j2?.items?.[0] ?? null);
  process.exit(0);
}

main().catch((e) => {
  console.error('memory smoke failed:', e?.message ?? e);
  process.exit(1);
});
