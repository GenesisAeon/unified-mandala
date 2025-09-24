import { spawn } from 'node:child_process';
import { exec as execCallback } from 'node:child_process';
import process from 'node:process';
import { promisify } from 'node:util';

const exec = promisify(execCallback);
const isWindows = process.platform === 'win32';
const pnpmBin = isWindows ? 'pnpm.cmd' : 'pnpm';
const nodeBin = process.execPath;
const NATS_URL = process.env.NATS_URL ?? 'nats://127.0.0.1:4222';

const children = new Set();

function prefixLog(name, chunk) {
  const text = typeof chunk === 'string' ? chunk : chunk.toString();
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  for (const line of lines) {
    if (!line) continue;
    process.stdout.write(`[${name}] ${line}\n`);
  }
}

function spawnLogged(name, command, args = [], options = {}) {
  const child = spawn(command, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });
  children.add(child);

  child.stdout?.setEncoding('utf8');
  child.stdout?.on('data', (data) => prefixLog(name, data));
  child.stderr?.setEncoding('utf8');
  child.stderr?.on('data', (data) => prefixLog(name, data));
  child.on('exit', (code, signal) => {
    children.delete(child);
    const status = signal ? `${signal}` : `code ${code ?? 0}`;
    process.stdout.write(`[${name}] exited (${status})\n`);
  });
  return child;
}

async function ensureNats() {
  const docker = isWindows ? 'docker.exe' : 'docker';
  const { stdout } = await exec(`${docker} ps -a --filter "name=^/nats$" --format "{{.Status}}"`);
  const status = stdout.trim();
  if (!status) {
    process.stdout.write('[start] launching nats container...\n');
    await exec(`${docker} run --name nats -p 4222:4222 -p 8222:8222 -d nats:latest -js`);
  } else if (!status.toLowerCase().startsWith('up')) {
    process.stdout.write('[start] starting existing nats container...\n');
    await exec(`${docker} start nats`);
  } else {
    process.stdout.write('[start] nats container already running.\n');
  }
  await exec(`${pnpmBin} nats:doctor`);
}

async function buildCosmicArtifacts() {
  process.stdout.write('[start] building cosmic-web artifacts...\n');
  await exec(`${pnpmBin} demo:cosmic`);
}

async function runSmoke(uiUrl) {
  process.stdout.write(`[start] running smoke against ${uiUrl}...\n`);
  spawnLogged('smoke', pnpmBin, ['smoke:ui'], {
    env: { ...process.env, UI_DEV_URL: uiUrl },
  });
}

async function main() {
  await ensureNats();
  await buildCosmicArtifacts();

  spawnLogged('services', nodeBin, ['scripts/dev-services.mjs', '--mode=dev'], {
    env: { ...process.env, NATS_URL },
  });

  const ticker = spawnLogged('cosmic-tick', pnpmBin, ['demo:cosmic:tick'], {
    env: { ...process.env, NATS_URL },
  });
  ticker.stdout?.on('data', () => {}); // ensure listener registered

  const uiArgs = ['-F', 'mandala-ui', 'dev', '--', '--port', '5173'];
  const ui = spawn(pnpmBin, uiArgs, {
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  children.add(ui);

  let smokeStarted = false;
  let announcedUrl = process.env.UI_DEV_URL ?? 'http://localhost:5173';

  if (process.env.UI_DEV_URL) {
    smokeStarted = true;
    runSmoke(announcedUrl);
  }

  ui.stdout?.setEncoding('utf8');
  ui.stdout?.on('data', (chunk) => {
    const text = chunk.toString();
    prefixLog('ui', text);
    if (smokeStarted) {
      return;
    }
    const match = text.match(/Local:\s+(http:\/\/localhost:(\d+))/i);
    if (match) {
      announcedUrl = match[1];
      smokeStarted = true;
      runSmoke(announcedUrl);
    }
  });

  ui.stderr?.setEncoding('utf8');
  ui.stderr?.on('data', (chunk) => {
    prefixLog('ui', chunk);
  });

  ui.on('exit', (code, signal) => {
    children.delete(ui);
    const status = signal ? `${signal}` : `code ${code ?? 0}`;
    process.stdout.write(`[ui] exited (${status})\n`);
  });

  process.stdout.write('[start] dev stack booting...\n');
  process.stdout.write(`[start] open ${announcedUrl}/demo/cosmic-web once ready.\n`);
}

function cleanupAndExit(code) {
  for (const child of [...children]) {
    try {
      child.kill('SIGTERM');
    } catch {
      // ignore
    }
  }
  setTimeout(() => {
    process.exit(code);
  }, 200);
}

process.on('SIGINT', () => {
  process.stdout.write('\n[start] received SIGINT – shutting down...\n');
  cleanupAndExit(130);
});

process.on('SIGTERM', () => {
  process.stdout.write('\n[start] received SIGTERM – shutting down...\n');
  cleanupAndExit(143);
});

main().catch((error) => {
  console.error('[start] failed:', error);
  cleanupAndExit(1);
});
