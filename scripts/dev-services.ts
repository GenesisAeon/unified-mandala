import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

interface ServiceDescriptor {
  name: string;
  dist: string;
  src: string;
  env?: Record<string, string>;
}

const services: ServiceDescriptor[] = [
  {
    name: 'rag-api',
    dist: 'dist/scripts/rag-api.js',
    src: 'scripts/rag-api.ts',
  },
  {
    name: 'flags-api',
    dist: 'dist/scripts/flags-api.js',
    src: 'scripts/flags-api.ts',
  },
  {
    name: 'experiments-api',
    dist: 'dist/scripts/experiments-api.js',
    src: 'scripts/experiments-api.ts',
  },
  {
    name: 'share-api',
    dist: 'dist/scripts/share-api.js',
    src: 'scripts/share-api.ts',
  },
  {
    name: 'realtime-hub',
    dist: 'dist/scripts/realtime-hub.js',
    src: 'scripts/realtime-hub.ts',
  },
];

const preferDist = process.argv.includes('--dist') || process.env.MANDALA_SERVICES_DIST === '1';
const repositoryRoot = process.cwd();
const tsxBinary = path.join(
  repositoryRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'tsx.cmd' : 'tsx',
);

const processes = new Map<string, ChildProcess>();
let shuttingDown = false;
let sawFailure = false;

function startService(descriptor: ServiceDescriptor) {
  const distPath = path.join(repositoryRoot, descriptor.dist);
  const useDist = preferDist || existsSync(distPath);

  const command = useDist && existsSync(distPath) ? process.execPath : tsxBinary;
  const args = useDist && existsSync(distPath) ? [distPath] : [descriptor.src];
  const label = useDist && existsSync(distPath) ? 'dist' : 'tsx';

  if (useDist && !existsSync(distPath)) {
    console.warn(
      `[${descriptor.name}] dist build missing at ${descriptor.dist}, falling back to tsx runtime.`,
    );
  }

  const child = spawn(command, args, {
    cwd: repositoryRoot,
    env: { ...process.env, ...descriptor.env },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  processes.set(descriptor.name, child);

  child.on('exit', (code, signal) => {
    processes.delete(descriptor.name);
    if (shuttingDown) {
      return;
    }

    if (code !== null && code !== 0) {
      sawFailure = true;
      console.error(`[${descriptor.name}] ${label} process exited with code ${code}.`);
    } else if (signal) {
      sawFailure = true;
      console.error(`[${descriptor.name}] ${label} process terminated by signal ${signal}.`);
    }
  });
}

function shutdown(signal: NodeJS.Signals) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  for (const child of processes.values()) {
    child.kill(signal);
  }
}

for (const service of services) {
  startService(service);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('exit', () => {
  if (sawFailure) {
    process.exitCode = 1;
  }
});
