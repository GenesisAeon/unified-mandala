#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import process from 'node:process';

const containerName = (process.env.NATS_DOCKER_NAME ?? 'unified-mandala-nats').trim();
const image = (process.env.NATS_DOCKER_IMAGE ?? 'nats:latest').trim();
const defaultPorts = '4222:4222 8222:8222';
const portTokens = (process.env.NATS_DOCKER_PORTS ?? defaultPorts)
  .split(/[\s,]+/)
  .map((token) => token.trim())
  .filter(Boolean);
const jetStreamTokens = (process.env.NATS_DOCKER_FLAGS ?? '-js')
  .split(/\s+/)
  .map((token) => token.trim())
  .filter(Boolean);
const extraArgs = (process.env.NATS_DOCKER_EXTRA_ARGS ?? '')
  .split(/\s+/)
  .map((token) => token.trim())
  .filter(Boolean);

const command = (process.argv[2] ?? 'up').toLowerCase();

function execDocker(args, { capture = false, allowFailure = false } = {}) {
  const result = spawnSync('docker', args, {
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    encoding: 'utf8',
  });

  if (result.error) {
    console.error(
      `[nats-docker] Failed to execute docker ${args.join(' ')}: ${result.error.message}`,
    );
    process.exit(1);
  }

  if (!allowFailure && (result.status ?? 1) !== 0) {
    if (capture) {
      if (result.stdout) process.stdout.write(result.stdout);
      if (result.stderr) process.stderr.write(result.stderr);
    }
    process.exit(result.status ?? 1);
  }

  return result;
}

function ensureDockerAvailable() {
  const check = execDocker(['--version'], { capture: true, allowFailure: true });
  if ((check.status ?? 1) !== 0) {
    console.error(
      '[nats-docker] Docker CLI not found. Install Docker Desktop or ensure it is on PATH.',
    );
    process.exit(1);
  }
}

function containerExists() {
  const inspect = execDocker(['inspect', containerName], { capture: true, allowFailure: true });
  return (inspect.status ?? 1) === 0;
}

function containerRunning() {
  const inspect = execDocker(['inspect', '-f', '{{.State.Running}}', containerName], {
    capture: true,
    allowFailure: true,
  });
  if ((inspect.status ?? 1) !== 0) return false;
  return inspect.stdout.trim() === 'true';
}

function runContainer() {
  const portArgs = portTokens.flatMap((mapping) => ['-p', mapping]);
  const args = [
    'run',
    '--name',
    containerName,
    ...portArgs,
    '-d',
    image,
    ...jetStreamTokens,
    ...extraArgs,
  ];
  console.log(
    `[nats-docker] Starting ${containerName} (${image}) with ports ${portTokens.join(', ')} ${jetStreamTokens.join(' ')}`,
  );
  execDocker(args);
}

function startContainer() {
  const start = execDocker(['start', containerName], { allowFailure: true });
  if ((start.status ?? 1) === 0) {
    console.log(`[nats-docker] Container ${containerName} started.`);
  } else {
    runContainer();
  }
}

function stopContainer() {
  const result = execDocker(['rm', '-f', containerName], { allowFailure: true });
  if ((result.status ?? 1) === 0) {
    console.log(`[nats-docker] Container ${containerName} removed.`);
  } else {
    console.log(`[nats-docker] No container named ${containerName} to remove.`);
  }
}

ensureDockerAvailable();

switch (command) {
  case 'up': {
    if (containerExists()) {
      if (containerRunning()) {
        console.log(`[nats-docker] Container ${containerName} already running.`);
      } else {
        startContainer();
      }
    } else {
      runContainer();
    }
    break;
  }
  case 'down': {
    stopContainer();
    break;
  }
  case 'restart': {
    stopContainer();
    runContainer();
    break;
  }
  case 'status': {
    if (!containerExists()) {
      console.log(`[nats-docker] Container ${containerName} not found.`);
    } else if (containerRunning()) {
      console.log(`[nats-docker] Container ${containerName} is running.`);
    } else {
      console.log(`[nats-docker] Container ${containerName} is stopped.`);
    }
    break;
  }
  default: {
    console.error('Usage: node scripts/nats-docker.mjs <up|down|restart|status>');
    process.exit(1);
  }
}
