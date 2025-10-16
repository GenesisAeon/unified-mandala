#!/usr/bin/env node
import assert from 'node:assert';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

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
  return { ok: r.ok, status: r.status, json, headers: r.headers };
}

(async () => {
  const h = await j(`${base}/boundary/health`);
  assert.equal(h.ok, true, `health not ok: ${h.status}`);

  const now = new Date().toISOString();
  const baseLaw = {
    ts: now,
    source: 'smoke',
    ruleId: 'smk',
    verdict: 'pass',
    severity: 'ok',
  };
  const idKey = stableBoundaryEventKey(baseLaw);
  const p = await j(`${base}/boundary/observe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'idempotency-key': idKey },
    body: JSON.stringify({ law: baseLaw }),
  });
  assert.equal(p.status, 202, `observe not accepted: ${p.status}`);
  assert.equal(p.json?.accepted, 1, 'accepted count mismatch');
  assert.equal(p.json?.idempotencyKey, idKey, 'response payload missing idempotency key');
  assert.equal(p.headers.get('idempotency-key'), idKey, 'response header missing idempotency key');
  assert.equal(p.headers.get('access-control-allow-origin'), '*', 'CORS origin not exposed');
  const exposeHeaders = p.headers.get('access-control-expose-headers') || '';
  assert.ok(
    exposeHeaders.toLowerCase().includes('idempotency-key'),
    'Idempotency-Key not exposed via Access-Control-Expose-Headers',
  );

  const dupLaw = { ...baseLaw, eventKey: '0'.repeat(40) };
  const dup = await j(`${base}/boundary/observe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'idempotency-key': idKey },
    body: JSON.stringify({ law: dupLaw }),
  });
  assert.equal(dup.status, 409, `duplicate should 409, got ${dup.status}`);
  assert.equal(dup.json?.idempotencyKey, idKey, 'duplicate payload lacks idempotency key');
  assert.equal(dup.headers.get('idempotency-key'), idKey, 'duplicate response missing header');
  assert.ok(
    Array.isArray(dup.json?.eventKeys) && dup.json.eventKeys.includes(idKey),
    'duplicate payload should list canonical event key',
  );
  assert.equal(
    dup.headers.get('access-control-allow-origin'),
    '*',
    'CORS origin missing on duplicate',
  );

  const canonicalLaw = {
    ts: new Date().toISOString(),
    source: 'smoke-2',
    ruleId: 'smk-2',
    verdict: 'pass',
    severity: 'ok',
    details: 'smoke-run',
  };
  const canonicalKey = stableBoundaryEventKey(canonicalLaw);
  const noHeader = await j(`${base}/boundary/observe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ law: canonicalLaw }),
  });
  assert.equal(noHeader.status, 202, `canonical observe failed: ${noHeader.status}`);
  assert.equal(noHeader.json?.idempotencyKey, canonicalKey, 'canonical response missing key');
  assert.equal(noHeader.headers.get('idempotency-key'), canonicalKey, 'canonical header mismatch');
  assert.equal(
    noHeader.headers.get('access-control-allow-origin'),
    '*',
    'CORS origin missing on canonical response',
  );

  const invalid = await j(`${base}/boundary/observe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.equal(invalid.status, 400, `invalid payload should 400, got ${invalid.status}`);
  assert.equal(
    invalid.headers.get('access-control-allow-origin'),
    '*',
    'CORS origin missing on invalid response',
  );

  const preflight = await fetch(`${base}/boundary/observe`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://example.test',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type, Idempotency-Key',
    },
  });
  assert.equal(preflight.status, 204, `preflight should return 204, got ${preflight.status}`);
  const allowHeaders = preflight.headers.get('access-control-allow-headers') || '';
  assert.ok(
    allowHeaders.toLowerCase().includes('idempotency-key'),
    'preflight missing Idempotency-Key in allow headers',
  );
  assert.equal(
    preflight.headers.get('access-control-allow-origin'),
    '*',
    'preflight missing Access-Control-Allow-Origin',
  );

  const statusResponse = await j(`${base}/boundary/status`);
  assert.equal(statusResponse.ok, true, `status route failed: ${statusResponse.status}`);
  assert.ok(statusResponse.json?.dedupe_store_size >= 1, 'status dedupe store size missing');
  assert.equal(
    statusResponse.headers.get('access-control-allow-origin'),
    '*',
    'status response missing CORS origin header',
  );

  const statusPath = join(process.cwd(), 'data', 'logs', 'boundary', 'status.json');
  const statusText = readFileSync(statusPath, 'utf8');
  const statusJson = JSON.parse(statusText);
  assert.ok(statusJson.dedupe_store_size >= 1, 'status.json store size missing');
  assert.ok(statusJson.dedupes_per_minute >= 1, 'status.json dedupes per minute missing');
  assert.ok(statusJson.dedupe_hits_total >= 1, 'status.json dedupe hits total missing');
  assert.ok(statusJson.last_duplicate_at, 'status.json missing last duplicate timestamp');

  const g = await j(`${base}/boundary/laws`);
  assert.equal(g.ok, true, `laws snapshot not found: ${g.status}`);

  const metrics = await fetch(`${base}/metrics`);
  assert.equal(metrics.ok, true, `metrics not accessible: ${metrics.status}`);
  const text = await metrics.text();
  const dedupeRegex = /boundary_law_deduped_total(?:{[^}]*})? (\d+(?:\.\d+)?)/;
  assert.match(text, dedupeRegex);
  const value = Number(text.match(dedupeRegex)?.[1] ?? '0');
  assert.ok(value >= 1, `dedupe counter expected >= 1, received ${value}`);
  assert.match(text, /boundary_observe_total\{result="accepted"[^}]*} \d+(?:\.\d+)?/);
  assert.match(text, /boundary_observe_total\{result="duplicate"[^}]*} \d+(?:\.\d+)?/);
  assert.match(text, /boundary_observe_total\{result="invalid"[^}]*} \d+(?:\.\d+)?/);
  const missingMatch = text.match(/boundary_idempotency_missing_total(?:{[^}]*})? (\d+(?:\.\d+)?)/);
  const missingValue = Number(missingMatch?.[1] ?? '0');
  assert.ok(missingValue >= 1, `expected idempotency missing counter >= 1, got ${missingValue}`);

  console.log('boundary-service-smoke: OK');
})().catch((e) => {
  console.error('boundary-service-smoke: FAIL', e?.message || e);
  process.exit(1);
});
