#!/usr/bin/env node
import assert from 'node:assert';
import { createHash } from 'node:crypto';

function stableBoundaryEventKey(law) {
  const raw = [
    law.ruleId ?? '',
    law.source ?? '',
    law.ts ?? '',
    law.verdict ?? '',
    law.severity ?? '',
    JSON.stringify(law.payload ?? law.details ?? null),
  ].join('|');
  return createHash('sha1').update(raw).digest('hex');
}

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
  const law = {
    ts: now,
    source: 'smoke',
    ruleId: 'smk',
    verdict: 'pass',
    severity: 'ok',
    eventKey: stableBoundaryEventKey({
      ts: now,
      source: 'smoke',
      ruleId: 'smk',
      verdict: 'pass',
      severity: 'ok',
    }),
  };
  const p = await j(`${base}/boundary/observe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ law }),
  });
  assert.equal(p.status, 202, `observe not accepted: ${p.status}`);

  const dup = await j(`${base}/boundary/observe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ law }),
  });
  assert.equal(dup.status, 409, `duplicate should 409, got ${dup.status}`);

  const g = await j(`${base}/boundary/laws`);
  assert.equal(g.ok, true, `laws snapshot not found: ${g.status}`);

  const metrics = await fetch(`${base}/metrics`);
  assert.equal(metrics.ok, true, `metrics not accessible: ${metrics.status}`);
  const text = await metrics.text();
  const dedupeRegex = /boundary_law_deduped_total(?:{[^}]*})? (\d+(?:\.\d+)?)/;
  assert.match(text, dedupeRegex);
  const value = Number(text.match(dedupeRegex)?.[1] ?? '0');
  assert.ok(value >= 1, `dedupe counter expected >= 1, received ${value}`);

  console.log('boundary-service-smoke: OK');
})().catch((e) => {
  console.error('boundary-service-smoke: FAIL', e?.message || e);
  process.exit(1);
});
