import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

let cachedInvocation = null;

export function resolvePythonInvocation() {
  if (cachedInvocation) {
    return cachedInvocation;
  }

  const explicit = (process.env.UM_PYTHON ?? process.env.PYTHON_BIN ?? '').trim();
  if (explicit) {
    cachedInvocation = { command: explicit, argsPrefix: [] };
    return cachedInvocation;
  }

  const venvPath = findVirtualEnvPath();
  if (venvPath) {
    const binDir = pythonBinDirectory(venvPath);
    for (const name of pythonBinaryNames()) {
      const candidate = path.join(binDir, name);
      if (existsSync(candidate)) {
        cachedInvocation = { command: candidate, argsPrefix: [] };
        return cachedInvocation;
      }
    }
  }

  for (const candidate of pythonCommandCandidates()) {
    if (commandWorks(candidate.command, candidate.argsPrefix)) {
      cachedInvocation = candidate;
      return cachedInvocation;
    }
  }

  throw new Error(
    'Unable to locate a Python 3 interpreter. Set UM_PYTHON to the desired executable or create a .venv first.',
  );
}

export function spawnPython(args, options = {}) {
  const invocation = resolvePythonInvocation();
  const finalArgs = [...(invocation.argsPrefix ?? []), ...args];
  return spawnSync(invocation.command, finalArgs, options);
}

export function pythonEnv(overrides = {}) {
  const env = { ...process.env };
  const venvPath = findVirtualEnvPath();
  const pythonPathDefault = path.join(repoRoot, 'src');

  if (!env.PYTHONPATH && !env.pythonpath) {
    env.PYTHONPATH = pythonPathDefault;
  }

  if (venvPath) {
    if (!env.VIRTUAL_ENV && !env.virtual_env) {
      env.VIRTUAL_ENV = venvPath;
    }
    prependPath(env, pythonBinDirectory(venvPath));
  }

  for (const [key, value] of Object.entries(overrides)) {
    env[key] = value;
  }

  return env;
}

function commandWorks(command, argsPrefix = []) {
  try {
    const result = spawnSync(command, [...argsPrefix, '--version'], {
      stdio: 'ignore',
    });
    return !result.error && (result.status ?? 1) === 0;
  } catch {
    return false;
  }
}

function findVirtualEnvPath() {
  const explicit = (process.env.VIRTUAL_ENV ?? process.env.virtual_env ?? '').trim();
  if (explicit && existsSync(explicit)) {
    return explicit;
  }
  const repoCandidate = path.join(repoRoot, '.venv');
  if (existsSync(repoCandidate)) {
    return repoCandidate;
  }
  return null;
}

function pythonBinDirectory(base) {
  return path.join(base, process.platform === 'win32' ? 'Scripts' : 'bin');
}

function pythonBinaryNames() {
  if (process.platform === 'win32') {
    return ['python.exe', 'python'];
  }
  return ['python3', 'python'];
}

function pythonCommandCandidates() {
  if (process.platform === 'win32') {
    return [
      { command: 'python', argsPrefix: [] },
      { command: 'python3', argsPrefix: [] },
      { command: 'py', argsPrefix: ['-3'] },
    ];
  }
  return [
    { command: 'python3', argsPrefix: [] },
    { command: 'python', argsPrefix: [] },
  ];
}

function prependPath(env, dir) {
  if (!dir) return;
  const delimiter = path.delimiter;
  const pathKey = Object.keys(env).find((key) => key.toUpperCase() === 'PATH') ?? 'PATH';
  const current = env[pathKey] ?? '';
  const segments = current.split(delimiter).filter(Boolean);
  if (!segments.includes(dir)) {
    env[pathKey] = env[pathKey] ? `${dir}${delimiter}${env[pathKey]}` : dir;
  }
}
