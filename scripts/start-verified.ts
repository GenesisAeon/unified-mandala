#!/usr/bin/env -S tsx
import { spawn } from 'node:child_process';
import process from 'node:process';

function computeHealthPort(): number {
  const off = Number.parseInt(process.env.PORT_OFFSET || '0', 10) || 0;
  return 3999 + off;
}

type Proc = ReturnType<typeof spawn>;

function run(name: string, cmd: string, args: string[], env?: NodeJS.ProcessEnv): Proc {
  const child = spawn(cmd, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...(env || {}) },
  });
  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
    }
  });
  return child;
}

async function waitOn(urls: string[], timeoutMs = 90_000): Promise<void> {
  const waitOn = await import('wait-on');
  await waitOn.default({ resources: urls, timeout: timeoutMs, window: 500 });
}

async function main() {
  const healthPort = computeHealthPort();
  const healthUrl = `http://127.0.0.1:${healthPort}/health`;
  const viteUrl = 'http://localhost:5173';

  console.log('[start-verified] Health URL:', healthUrl);
  console.log('[start-verified] UI URL:', viteUrl);

  const procs: Proc[] = [];

  // UI (Vite)
  procs.push(run('ui', 'pnpm', ['-F', 'mandala-ui', 'dev']));

  // Dev stack (services orchestrator)
  procs.push(run('stack', 'pnpm', ['dev:stack']));

  // Health aggregator
  procs.push(run('health', 'pnpm', ['dev:health']));

  let shuttingDown = false;
  function shutdown(code = 0) {
    if (shuttingDown) return;
    shuttingDown = true;
    for (const p of procs) {
      try {
        if (process.platform === 'win32') p.kill();
        else p.kill('SIGTERM');
      } catch {}
    }
    process.exit(code);
  }

  process.on('SIGINT', () => shutdown(130));
  process.on('SIGTERM', () => shutdown(143));

  try {
    console.log('[start-verified] Waiting for services to become healthy...');
    await waitOn([healthUrl, viteUrl], 120_000);
    console.log('[start-verified] Services healthy. Running smoke test...');
    const smoke = run('smoke', 'pnpm', ['smoke:live']);
    smoke.on('exit', (code) => {
      if (code === 0) console.log('[start-verified] Smoke OK');
      else console.error('[start-verified] Smoke failed');
    });
  } catch (e: any) {
    console.error('[start-verified] Wait failed:', e?.message || e);
    shutdown(1);
  }
}

main().catch((e) => {
  console.error('[start-verified] Fatal:', e);
  process.exit(1);
});
