#!/usr/bin/env node
/* eslint-disable no-console */
import { spawn, spawnSync } from 'node:child_process';

const VERIFY_GATE_URL = process.env.VERIFY_GATE_URL || 'http://127.0.0.1:3111';
const ETHICS_URL = process.env.ETHICS_URL || 'http://127.0.0.1:3110';
const API_URL = process.env.API_URL || 'http://127.0.0.1:4000';
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

(async () => {
  console.log(`[chaos] Verify-Gate: ${VERIFY_GATE_URL}`);
  console.log(`[chaos] Ethics:      ${ETHICS_URL}`);
  console.log(`[chaos] API:         ${API_URL}`);
  await waitReady(VERIFY_GATE_URL);

  let child;
  if (MANAGE) {
    const port = Number(new URL(ETHICS_URL).port || 3110);
    console.log('[chaos] Restarting ethics-api with strict OPA timeout …');
    spawnSync('pnpm', ['dlx', 'kill-port', String(port)], { stdio: 'inherit' });
    child = spawn('pnpm', ['start:ethics'], {
      stdio: 'inherit',
      shell: false,
      detached: true,
      env: {
        ...process.env,
        ETHICS_OPA_ENABLE: '1',
        ETHICS_OPA_TIMEOUT_MS: '1',
      },
    });
    await waitReady(ETHICS_URL);
  }

  const res = await fetch(`${API_URL}/api/ai/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: 'fail-closed drill' },
        { role: 'user', content: 'Trigger OPA timeout path' },
      ],
    }),
  });

  console.log(
    `[chaos] response -> ${res.status} (X-Verify-Degraded: ${res.headers.get('x-verify-degraded') || '-'})`,
  );
  if (res.status !== 428) throw new Error(`expected 428, got ${res.status}`);
  const degraded = res.headers.get('x-verify-degraded');
  if (!degraded) throw new Error('missing X-Verify-Degraded header');

  console.log('[chaos] OK ✅');
  if (child) {
    try {
      process.kill(-child.pid);
    } catch {}
  }
  process.exit(0);
})().catch((error) => {
  console.error('[chaos] FAIL ❌', error.message);
  process.exit(1);
});
