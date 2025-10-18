#!/usr/bin/env node
import { setTimeout as delay } from 'node:timers/promises';
import { randomUUID } from 'node:crypto';
import process from 'node:process';
import { fetch } from 'undici';

const offset = Number.parseInt(process.env.PORT_OFFSET ?? '0', 10) || 0;
const verifyBase = process.env.CHAOS_VERIFY_URL ?? `http://127.0.0.1:${3111 + offset}`;

async function postGate(path, body) {
  const url = `${verifyBase}/gate${path.startsWith('/') ? path : `/${path}`}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'idempotency-key': randomUUID(),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }
    return { status: res.status, headers: res.headers, body: json };
  } finally {
    clearTimeout(timeout);
  }
}

async function step(name, fn) {
  process.stdout.write(`\n=== ${name} ===\n`);
  try {
    const result = await fn();
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return { name, ok: true };
  } catch (error) {
    process.stdout.write(`ERROR: ${error instanceof Error ? error.message : String(error)}\n`);
    return { name, ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

async function main() {
  const results = [];
  results.push(
    await step('1) Baseline ethics check', async () => {
      const response = await postGate('/api/ai/chat', {
        intent: 'chaos-baseline',
        content: { message: 'hello' },
      });
      return {
        status: response.status,
        verdict: response.headers.get('x-ethics-verdict'),
        evidenceCount: response.headers.get('x-ethics-evidence-count'),
        degraded: response.headers.get('x-ethics-degraded') ?? null,
        body: response.body,
      };
    }),
  );

  process.stdout.write('\n-- Bitte Boundary deaktivieren (oder Chaos-Szenario triggern) --\n');
  await delay(1000);
  results.push(
    await step('2) Boundary outage probe', async () => {
      const response = await postGate('/api/ai/chat', {
        intent: 'chaos-boundary',
        content: { message: 'check boundary outage' },
      });
      return {
        status: response.status,
        verdict: response.headers.get('x-ethics-verdict'),
        degraded: response.headers.get('x-ethics-degraded') ?? null,
        body: response.body,
      };
    }),
  );

  process.stdout.write('\n-- Bitte Ethics-API stoppen (Fail-Closed Prüfung) --\n');
  await delay(1000);
  results.push(
    await step('3) Ethics outage probe', async () => {
      const response = await postGate('/api/ai/chat', {
        intent: 'chaos-ethics',
        content: { message: 'ethics outage' },
      });
      return {
        status: response.status,
        body: response.body,
      };
    }),
  );

  const summary = {
    ok: results.every((r) => r.ok),
    steps: results,
  };
  process.stdout.write(`\nSummary: ${JSON.stringify(summary, null, 2)}\n`);
  if (!summary.ok) {
    process.exitCode = 1;
  }
}

await main();
