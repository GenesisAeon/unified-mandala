#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
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
  },
  {
    name: 'flags-api',
    script: 'scripts/flags-api.ts',
  },
  {
    name: 'experiments-api',
    script: 'scripts/experiments-api.ts',
  },
  {
    name: 'share-api',
    script: 'scripts/share-api.ts',
  },
  {
    name: 'realtime-hub',
    script: 'scripts/realtime-hub.ts',
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

const processes = [];

function spawnService(service) {
  const env = {
    ...process.env,
    SERVICE_NAME: service.name,
    UM_SERVICE_MODE: resolvedMode,
  };

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
  spawnService(service);
}
