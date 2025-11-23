#!/usr/bin/env node
import { setTimeout as delay } from 'node:timers/promises';
import { randomUUID } from 'node:crypto';
import process from 'node:process';
import { fetch } from 'undici';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import assert from 'node:assert/strict';

const offset = Number.parseInt(process.env.PORT_OFFSET ?? '0', 10) || 0;
const verifyBase = process.env.CHAOS_VERIFY_URL ?? `http://127.0.0.1:${3111 + offset}`;
const execFileAsync = promisify(execFile);
const options = parseArgs(process.argv.slice(2));

if (options.scenario === 'boundary-down') {
  try {
    const result = await runBoundaryDown(options.expect);
    process.stdout.write(`\n=== Boundary-down result ===\n${JSON.stringify(result, null, 2)}\n`);
    process.exit(result.ok ? 0 : 1);
  } catch (error) {
    console.error('Boundary-down scenario failed', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

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

function parseArgs(argv) {
  const opts = { scenario: undefined, expect: undefined };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith('--scenario')) {
      const value = arg.includes('=') ? arg.split('=')[1] : argv[i + 1];
      if (!arg.includes('=') && value !== undefined) {
        i += 1;
      }
      if (value) {
        opts.scenario = value;
      }
    } else if (arg.startsWith('--expect')) {
      const value = arg.includes('=') ? arg.split('=')[1] : argv[i + 1];
      if (!arg.includes('=') && value !== undefined) {
        i += 1;
      }
      if (value) {
        opts.expect = value;
      }
    }
  }
  return opts;
}

async function killPort(port) {
  try {
    const { stdout } = await execFileAsync('lsof', ['-t', `-i:${port}`]);
    const pids = stdout
      .split(/\s+/)
      .map((value) => Number.parseInt(value, 10))
      .filter((value) => Number.isFinite(value));
    for (const pid of pids) {
      try {
        process.kill(pid);
      } catch {}
    }
    return { killed: pids.length, pids };
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? (error.code ?? error.exitCode)
        : undefined;
    if (code === 'ENOENT') {
      return { killed: 0, pids: [], error: 'lsof_not_found' };
    }
    if (code === 1 || code === '1') {
      return { killed: 0, pids: [] };
    }
    return { killed: 0, pids: [], error: error instanceof Error ? error.message : String(error) };
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

async function runBoundaryDown(expect) {
  const boundaryPort = Number.parseInt(process.env.BOUNDARY_PORT ?? '', 10);
  const targetPort = (Number.isFinite(boundaryPort) ? boundaryPort : 4010) + offset;
  const killResult = await killPort(targetPort);
  await delay(1000);
  const response = await postGate('/api/ai/chat', {
    intent: 'chaos-boundary-down',
    content: { message: 'boundary outage drill' },
  });
  const verdictHeader = response.headers.get('x-ethics-verdict');
  const degradedHeader = response.headers.get('x-ethics-degraded');
  const failClosed =
    response.status >= 500 || verdictHeader === 'red' || response.body?.verdict === 'red';
  if (expect === 'failclosed') {
    assert(
      failClosed,
      `expected fail-closed but got status=${response.status} verdict=${verdictHeader ?? response.body?.verdict ?? 'unknown'}`,
    );
  }
  return {
    ok: failClosed,
    failClosed,
    killed: killResult,
    status: response.status,
    verdict: verdictHeader ?? response.body?.verdict ?? null,
    headers: {
      'x-ethics-verdict': verdictHeader,
      'x-ethics-degraded': degradedHeader,
      'x-ethics-evidence-count': response.headers.get('x-ethics-evidence-count'),
    },
    body: response.body,
  };
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
  results.push(await step('2) Boundary outage probe (auto)', async () => runBoundaryDown()));

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

if (options.scenario !== 'boundary-down') {
  await main();
}
