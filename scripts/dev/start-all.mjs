#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const isWindows = process.platform === 'win32';

const run = (cmd, args = [], env = {}) =>
  spawn(cmd, args, {
    stdio: 'inherit',
    shell: isWindows,
    env: { ...process.env, ...env },
    cwd: ROOT,
  });

const PORT_OFFSET = Number(process.env.PORT_OFFSET ?? '0') || 0;

const BASE_PORTS = {
  HEALTH: 3999,
  API: 4000,
  BOUNDARY: 4010,
  REALTIME: 4020,
  RAG: 3003,
  EXPERIMENTS: 3002,
  FLAGS: 3004,
};

const ports = Object.fromEntries(
  Object.entries(BASE_PORTS).map(([key, value]) => [key, value + PORT_OFFSET]),
);

const envBase = {
  UM_DEV_AUTODISABLE_NATS: '1',
  ENABLE_BOUNDARY: '1',
  PORT_OFFSET: String(PORT_OFFSET),
  AI_PROVIDER: 'openai',
  AI_BASE_URL: 'http://127.0.0.1:11434/v1',
  OPENAI_API_KEY: 'ollama',
  OPENAI_MODEL: 'qwen2.5:7b',
  OPENAI_EMBEDDING_MODEL: 'nomic-embed-text',
  EMBEDDINGS_BASE_URL: 'http://127.0.0.1:11434/v1',
  VERIFY_GATE_MAX_REDIRECTS: '3',
  VERIFY_GATE_KEEPALIVE_MAX_MS: '30000',
  VERIFY_GATE_UPSTREAM_HEADERS_TIMEOUT_MS: '15000',
  VERIFY_GATE_UPSTREAM_BODY_TIMEOUT_MS: '60000',
  VERIFY_GATE_REQUIRE_POLICY_SIGNATURE: '0',
  ETHICS_POLICY_SIGNATURE_REQUIRED: '0',
};

const bootstrap = spawnSync('pnpm', ['opa:bootstrap'], {
  stdio: 'inherit',
  shell: isWindows,
  cwd: ROOT,
});

if ((bootstrap.status ?? 0) !== 0) {
  console.error('[dev:all] Failed to download or locate OPA binary.');
  process.exit(bootstrap.status ?? 1);
}

const killPortArgs = [
  ports.HEALTH,
  ports.API,
  ports.BOUNDARY,
  ports.REALTIME,
  ports.RAG,
  ports.EXPERIMENTS,
  ports.FLAGS,
  5173 + PORT_OFFSET,
  5174 + PORT_OFFSET,
  5175 + PORT_OFFSET,
].map(String);

if (killPortArgs.length > 0) {
  spawnSync('pnpm', ['dlx', 'kill-port', ...killPortArgs], {
    stdio: 'inherit',
    shell: isWindows,
    cwd: ROOT,
  });
}

const processes = [];

const addProcess = (child) => {
  processes.push(child);
  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`[dev:all] Process exited with code ${code}`);
      stopAll();
      process.exit(code);
    }
  });
};

const stopAll = () => {
  for (const child of processes) {
    if (child && !child.killed) {
      try {
        child.kill('SIGINT');
      } catch {
        // ignore
      }
    }
  }
};

addProcess(run('pnpm', ['dev:stack'], envBase));
addProcess(run('pnpm', ['start:ethics'], envBase));
addProcess(run('pnpm', ['start:verify-gate'], envBase));
addProcess(run('pnpm', ['-F', 'mandala-ui', 'dev'], envBase));

process.on('SIGINT', () => {
  stopAll();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopAll();
  process.exit(0);
});

process.on('exit', () => {
  stopAll();
});
