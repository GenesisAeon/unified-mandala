#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const modeArg = process.argv.find((arg) => arg.startsWith('--mode='));
const explicitMode = modeArg ? modeArg.split('=')[1]?.toLowerCase() : undefined;
const resolvedMode =
  explicitMode === 'prod' || explicitMode === 'production'
    ? 'prod'
    : explicitMode === 'dev' || explicitMode === 'development'
      ? 'dev'
      : process.env.NODE_ENV === 'production'
        ? 'prod'
        : 'dev';

const serviceDefinitions = [
  {
    name: 'rag-api',
    script: 'scripts/rag-api.ts',
    envDefaults: { RAG_API_PORT: '3003' },
    portKeys: ['RAG_API_PORT'],
  },
  {
    name: 'flags-api',
    script: 'scripts/flags-api.ts',
    envDefaults: { FLAGS_API_PORT: '3004' },
    portKeys: ['FLAGS_API_PORT', 'PORT'],
  },
  {
    name: 'experiments-api',
    script: 'scripts/experiments-api.ts',
    envDefaults: { EXPERIMENTS_API_PORT: '3002' },
    portKeys: ['EXPERIMENTS_API_PORT'],
  },
  {
    name: 'share-api',
    script: 'scripts/share-api.ts',
    envDefaults: { SHARE_API_PORT: '3001' },
    portKeys: ['SHARE_API_PORT'],
  },
  {
    name: 'realtime-hub',
    script: 'scripts/realtime-hub.ts',
    envDefaults: { REALTIME_HUB_PORT: '4020', REALTIME_WS_PORT: '4021' },
    portKeys: ['REALTIME_HUB_PORT', 'REALTIME_WS_PORT'],
  },
];

const missingProdTargets = [];
if (resolvedMode === 'prod') {
  for (const service of serviceDefinitions) {
    const target = path.resolve(repoRoot, 'dist', service.script.replace(/\.ts$/, '.js'));
    if (!fs.existsSync(target)) {
      missingProdTargets.push({ name: service.name, target });
    }
  }
  if (missingProdTargets.length > 0) {
    console.error('[dev-services] Missing build artifacts for:');
    for (const missing of missingProdTargets) {
      console.error(`  - ${missing.name}: ${path.relative(repoRoot, missing.target)}`);
    }
    console.error('Run "pnpm build" before starting services in production mode.');
    process.exit(1);
  }
}

const skipPortChecks = process.env.UM_DEV_SERVICES_SKIP_PORT_CHECK === '1';

const processes = [];

async function spawnService(service) {
  const env = {
    ...process.env,
    SERVICE_NAME: service.name,
    UM_SERVICE_MODE: resolvedMode,
  };

  if (service.envDefaults) {
    for (const [key, value] of Object.entries(service.envDefaults)) {
      const current = env[key];
      if (current === undefined || current === '') {
        env[key] = value;
      }
    }
  }

  if (!skipPortChecks) {
    await ensurePortsAvailable(service, env);
  }

  if (resolvedMode === 'prod') {
    const entry = path.resolve(repoRoot, 'dist', service.script.replace(/\.ts$/, '.js'));
    const child = spawn(process.execPath, [entry], { stdio: 'inherit', env, cwd: repoRoot });
    registerChild(service, child);
    return;
  }

  const relativeScript = path.relative(repoRoot, path.resolve(repoRoot, service.script));
  const child = spawn('pnpm', ['exec', 'tsx', relativeScript], {
    stdio: 'inherit',
    env,
    cwd: repoRoot,
    shell: process.platform === 'win32',
  });
  registerChild(service, child);
}

function registerChild(service, child) {
  processes.push(child);
  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`[dev-services] ${service.name} exited due to signal ${signal}`);
      return;
    }
    if (code !== 0) {
      console.error(`[dev-services] ${service.name} exited with code ${code}`);
      process.exitCode = code ?? 1;
    } else {
      console.log(`[dev-services] ${service.name} stopped successfully.`);
    }
  });
}

function shutdown(signal = 'SIGINT') {
  for (const child of processes) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
}

process.on('SIGINT', () => {
  shutdown('SIGINT');
});
process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});

console.log(
  `[dev-services] Starting ${serviceDefinitions.length} services in ${resolvedMode} mode...`,
);
for (const service of serviceDefinitions) {
  await spawnService(service);
}

function collectPortCandidates(service, env) {
  const keys = service.portKeys ?? [];
  const explicit = new Set(keys);
  const envKeys = new Set([
    ...explicit,
    ...Object.keys(service.envDefaults ?? {}).filter((key) => /PORT$/i.test(key)),
  ]);

  const results = [];
  for (const key of envKeys) {
    const raw = env[key];
    if (!raw) continue;
    const port = Number.parseInt(String(raw), 10);
    if (Number.isNaN(port)) continue;
    results.push({ key, port });
  }
  return results;
}

async function ensurePortsAvailable(service, env) {
  const candidates = collectPortCandidates(service, env);
  if (candidates.length === 0) return;

  const conflicts = [];
  for (const candidate of candidates) {
    const available = await isPortAvailable(candidate.port);
    if (!available) {
      conflicts.push(candidate);
    }
  }

  if (conflicts.length > 0) {
    console.error(`[dev-services] Port check failed for ${service.name}:`);
    for (const conflict of conflicts) {
      console.error(
        `  - ${conflict.key}=${conflict.port} already in use. Override the env var or run "pnpm dev:ports:free" / "pnpm dlx kill-port ${conflict.port}" first.`,
      );
    }
    process.exit(1);
  }
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const tester = net.createServer();
    tester.once('error', (err) => {
      if ('code' in err && err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        resolve(true);
      }
    });
    tester.once('listening', () => {
      tester.close(() => {
        resolve(true);
      });
    });
    tester.listen({ port, host: '127.0.0.1' });
  });
}
