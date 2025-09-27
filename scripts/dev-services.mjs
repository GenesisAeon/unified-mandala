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
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const modeArg = process.argv.find((arg) => arg.startsWith('--mode='));
const profileArg = process.argv.find((arg) => arg.startsWith('--profile='));
const lowMemFlag = process.argv.some((arg) => arg === '--low-mem');
const explicitMode = modeArg ? modeArg.split('=')[1]?.toLowerCase() : undefined;
const resolvedMode =
  explicitMode === 'prod' || explicitMode === 'production'
    ? 'prod'
    : explicitMode === 'dev' || explicitMode === 'development'
      ? 'dev'
      : process.env.NODE_ENV === 'production'
        ? 'prod'
        : 'dev';

const resolvedProfile = (profileArg ? profileArg.split('=')[1] : process.env.UM_PROFILE || 'std')
  .toString()
  .toLowerCase();

const preflightPackages = [
  {
    name: '@unified-mandala/ai',
    outputs: ['packages/ai/dist/index.js', 'packages/ai/dist/index.d.ts'],
    command: ['-F', '@unified-mandala/ai', 'build'],
  },
];

// Base service registry (full set)
const serviceDefinitionsAll = [
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
    name: 'ai-api',
    script: 'apps/api/src/index.ts',
    envDefaults: { PORT: '4000' },
    portKeys: ['PORT'],
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
  {
    name: 'health-aggregator',
    script: 'scripts/health-aggregator.ts',
    envDefaults: { UM_HEALTH_PORT: '3999' },
    portKeys: ['UM_HEALTH_PORT'],
  },
];

// Profile selection
let serviceDefinitions = serviceDefinitionsAll;
if (resolvedProfile === 'lite' || resolvedProfile === 'light' || resolvedProfile === 'minimal') {
  serviceDefinitions = serviceDefinitionsAll.filter((s) =>
    ['ai-api', 'share-api', 'flags-api', 'health-aggregator'].includes(s.name),
  );
}

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
const autoFreePortsEnabled = process.env.UM_DEV_SERVICES_AUTOFREE_PORTS !== '0';
const attemptedAutoFree = new Set();

const processes = [];

// Opportunistic NATS detection: if not reachable locally, prefer in-memory fallbacks
async function detectNatsAvailability() {
  const host = process.env.NATS_HOST || '127.0.0.1';
  const port = Number.parseInt(process.env.NATS_PORT || '4222', 10) || 4222;
  const timeoutMs = 400;
  const ok = await new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const onDone = (result) => {
      try {
        socket.destroy();
      } catch {}
      resolve(result);
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => onDone(true));
    socket.once('timeout', () => onDone(false));
    socket.once('error', () => onDone(false));
  });
  if (!ok && process.env.DISABLE_NATS !== '0') {
    process.env.DISABLE_NATS = process.env.DISABLE_NATS || '1';
    console.warn('[dev-services] NATS not reachable, setting DISABLE_NATS=1 for child processes.');
  }
}

async function spawnService(service) {
  const env = {
    ...process.env,
    SERVICE_NAME: service.name,
    UM_SERVICE_MODE: resolvedMode,
    UM_PROFILE: resolvedProfile,
  };

  if (service.envDefaults) {
    for (const [key, value] of Object.entries(service.envDefaults)) {
      const current = env[key];
      if (current === undefined || current === '') {
        env[key] = value;
      }
    }
  }

  // Low-memory / CPU-friendly defaults
  const lowMem = lowMemFlag || process.env.UM_LOW_MEM === '1' || process.env.LOW_MEM === '1';
  if (lowMem || resolvedProfile === 'lite') {
    env.LOW_MEM = env.LOW_MEM || '1';
    env.VITE_LOW_MEM = env.VITE_LOW_MEM || 'on';
    env.NODE_OPTIONS = env.NODE_OPTIONS || '--max-old-space-size=1024';
    env.UV_THREADPOOL_SIZE = env.UV_THREADPOOL_SIZE || '2';
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

await ensureWorkspacePrebuilds();
await detectNatsAvailability();

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
  const offRaw = env.PORT_OFFSET || '0';
  const off = Number.parseInt(String(offRaw), 10) || 0;
  for (const key of envKeys) {
    const raw = env[key];
    if (!raw) continue;
    const port = Number.parseInt(String(raw), 10);
    if (Number.isNaN(port)) continue;
    results.push({ key, port: port + off });
  }
  return results;
}

async function ensurePortsAvailable(service, env) {
  const candidates = collectPortCandidates(service, env);
  if (candidates.length === 0) return;

  let conflicts = await findPortConflicts(candidates);

  if (conflicts.length > 0) {
    if (autoFreePortsEnabled) {
      const portsToFree = [...new Set(conflicts.map((entry) => entry.port))].filter(
        (port) => !attemptedAutoFree.has(port),
      );
      if (portsToFree.length > 0) {
        for (const port of portsToFree) {
          attemptedAutoFree.add(port);
        }
        const freed = await attemptAutoFreePorts(portsToFree);
        if (freed) {
          await sleep(150);
          conflicts = await findPortConflicts(candidates);
          if (conflicts.length === 0) {
            console.log(
              `[dev-services] Freed occupied ports (${portsToFree.join(', ')}) automatically for ${service.name}.`,
            );
            return;
          }
        }
      }
    }

    console.error(`[dev-services] Port check failed for ${service.name}:`);
    for (const conflict of conflicts) {
      console.error(
        `  - ${conflict.key}=${conflict.port} already in use. Override the env var or run "pnpm dev:ports:free" / "pnpm dlx kill-port ${conflict.port}" first.`,
      );
    }
    if (!autoFreePortsEnabled) {
      console.error(
        '[dev-services] Hint: set UM_DEV_SERVICES_AUTOFREE_PORTS=1 (default) to let the orchestrator attempt automatic cleanup via `pnpm dlx kill-port`.',
      );
    } else {
      console.error(
        '[dev-services] Automatic cleanup via `pnpm dlx kill-port` did not resolve the conflicts. Verify running processes or rerun with UM_DEV_SERVICES_AUTOFREE_PORTS=0 to disable auto-free.',
      );
    }
    process.exit(1);
  }
}

async function ensureWorkspacePrebuilds() {
  if (process.env.UM_DEV_SERVICES_SKIP_PREBUILD === '1') {
    console.log(
      '[dev-services] Skipping workspace prebuild checks (UM_DEV_SERVICES_SKIP_PREBUILD=1).',
    );
    return;
  }

  const missing = [];
  for (const entry of preflightPackages) {
    const missingOutputs = entry.outputs
      .map((relativePath) => ({
        path: relativePath,
        exists: fs.existsSync(path.resolve(repoRoot, relativePath)),
      }))
      .filter((item) => !item.exists);

    if (missingOutputs.length > 0) {
      missing.push({ entry, missingOutputs });
    }
  }

  if (missing.length === 0) {
    return;
  }

  console.log(`[dev-services] Preparing ${missing.length} workspace package(s) for dev mode...`);

  for (const { entry, missingOutputs } of missing) {
    console.log(
      `[dev-services] → Building ${entry.name} (missing: ${missingOutputs
        .map((item) => item.path)
        .join(', ')})`,
    );
    await runPnpm(entry.command);

    const unresolved = entry.outputs.filter(
      (relativePath) => !fs.existsSync(path.resolve(repoRoot, relativePath)),
    );
    if (unresolved.length > 0) {
      throw new Error(
        `Failed to materialise build artefacts for ${entry.name}: ${unresolved.join(', ')}`,
      );
    }
  }
}

function runPnpm(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('pnpm', args, {
      stdio: 'inherit',
      cwd: repoRoot,
      env: process.env,
      shell: process.platform === 'win32',
    });
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`pnpm exec ${args.join(' ')} terminated via signal ${signal}`));
        return;
      }
      if (code !== 0) {
        reject(new Error(`pnpm exec ${args.join(' ')} exited with code ${code}`));
        return;
      }
      resolve();
    });
    child.on('error', (error) => {
      reject(error);
    });
  });
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

async function findPortConflicts(candidates) {
  const conflicts = [];
  for (const candidate of candidates) {
    const available = await isPortAvailable(candidate.port);
    if (!available) {
      conflicts.push(candidate);
    }
  }
  return conflicts;
}

async function attemptAutoFreePorts(ports) {
  if (ports.length === 0) {
    return false;
  }

  console.warn(
    `[dev-services] Attempting to free occupied ports via "pnpm dlx kill-port": ${ports.join(', ')}`,
  );

  return new Promise((resolve) => {
    const child = spawn('pnpm', ['dlx', 'kill-port', ...ports.map((port) => String(port))], {
      stdio: 'inherit',
      cwd: repoRoot,
      shell: process.platform === 'win32',
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        console.error(`[dev-services] pnpm dlx kill-port exited with code ${code}.`);
        resolve(false);
      }
    });

    child.on('error', (error) => {
      console.error(`[dev-services] Failed to run pnpm dlx kill-port: ${error.message}`);
      resolve(false);
    });
  });
}
