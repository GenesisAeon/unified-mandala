#!/usr/bin/env node
import assert from 'node:assert';

const base = process.env.BOUNDARY_BASE || 'http://127.0.0.1:4010';

async function j(url, init) {
  const r = await fetch(url, init);
  const json = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, json };
}

(async () => {
  const h = await j(`${base}/boundary/health`);
  assert.equal(h.ok, true, `health not ok: ${h.status}`);

  const now = new Date().toISOString();
  const p = await j(`${base}/boundary/observe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      law: { ts: now, source: 'smoke', ruleId: 'smk', verdict: 'pass', severity: 'ok' },
    }),
  });
  assert.equal(p.status, 202, `observe not accepted: ${p.status}`);

  const g = await j(`${base}/boundary/laws`);
  assert.equal(g.ok, true, `laws snapshot not found: ${g.status}`);

  console.log('boundary-service-smoke: OK');
})().catch((e) => {
  console.error('boundary-service-smoke: FAIL', e?.message || e);
  process.exit(1);
});
