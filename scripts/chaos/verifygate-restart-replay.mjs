#!/usr/bin/env node
/* eslint-disable no-console */
import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const VERIFY_GATE_URL = process.env.VERIFY_GATE_URL || 'http://127.0.0.1:3111';
const TARGET_URL = process.env.TARGET_URL || 'http://127.0.0.1:4000/api/ai/chat';
const MANAGE = process.argv.includes('--manage');

async function waitReady(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${url}/readyz`, { cache: 'no-store' });
      if (res.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`readyz timeout for ${url}`);
}

async function postOnce(idemKey) {
  const body = { intent: 'factual_claim', content: 'Ping from chaos', context: {} };
  return fetch(TARGET_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'idempotency-key': idemKey,
    },
    body: JSON.stringify(body),
  });
}

(async () => {
  console.log(`[chaos] Verify-Gate: ${VERIFY_GATE_URL}`);
  console.log(`[chaos] Target:      ${TARGET_URL}`);
  await waitReady(VERIFY_GATE_URL);

  const idem = randomUUID();
  console.log(`[chaos] First request with Idempotency-Key ${idem}`);
  const r1 = await postOnce(idem);
  console.log(`[chaos] r1 -> ${r1.status}`);
  if (r1.status === 409) throw new Error('unexpected 409 on first attempt');

  console.log('[chaos] Immediate replay with same key -> expect 409');
  const r2 = await postOnce(idem);
  console.log(`[chaos] r2 -> ${r2.status}`);
  if (r2.status !== 409) throw new Error(`replay not blocked: got ${r2.status}`);

  if (MANAGE) {
    const port = Number(new URL(VERIFY_GATE_URL).port || 3111);
    console.log('[chaos] Restarting verify-gate to validate persistence');
    spawnSync('pnpm', ['dlx', 'kill-port', String(port)], { stdio: 'inherit' });
    const child = spawn('pnpm', ['start:verify-gate'], {
      stdio: 'inherit',
      shell: false,
      detached: true,
    });
    await waitReady(VERIFY_GATE_URL);
    console.log('[chaos] Gate back up');
    const r3 = await postOnce(idem);
    console.log(`[chaos] r3 -> ${r3.status}`);
    if (r3.status !== 409) throw new Error(`persisted replay not blocked: got ${r3.status}`);
    try {
      process.kill(-child.pid);
    } catch {}
  }

  console.log('[chaos] OK ✅');
  process.exit(0);
})().catch((error) => {
  console.error('[chaos] FAIL ❌', error.message);
  process.exit(1);
});
