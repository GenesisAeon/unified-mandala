#!/usr/bin/env node
import process from 'node:process';
import { spawnPython, pythonEnv } from './lib/python.mjs';

function printHelp() {
  console.log(
    `Usage: node scripts/run-pytest.mjs [pytest args]\n\n` +
      `Runs pytest using the repository virtual environment if available.\n` +
      `Without additional arguments the default selection "not slow and not experimental" is applied with -q.\n` +
      `Environment overrides:\n` +
      `  UM_PYTEST_MARK           Override the default -m expression.\n` +
      `  UM_PYTEST_SKIP_DEFAULT   Set to 1 to disable default arguments when none are provided.\n` +
      `  UM_PYTEST_QUIET          Set to 0 to omit -q from the default arguments.`,
  );
}

function shouldShowHelp(args) {
  return args.some((arg) => arg === '--help' || arg === '-h');
}

function defaultArgs() {
  const marker = (process.env.UM_PYTEST_MARK ?? 'not slow and not experimental').trim();
  const quietFlag = (process.env.UM_PYTEST_QUIET ?? '1').trim() !== '0';
  const args = [];
  if (marker.length > 0) {
    args.push('-m', marker);
  }
  if (quietFlag) {
    args.push('-q');
  }
  return args;
}

function ensureStatus(result) {
  if (result.error) {
    console.error('[run-pytest] Failed to execute pytest:', result.error.message);
    process.exit(result.status ?? 1);
  }

  if (typeof result.status === 'number') {
    process.exit(result.status);
  }

  if (result.signal) {
    console.error(`[run-pytest] pytest terminated via signal ${result.signal}`);
    process.exit(1);
  }

  process.exit(0);
}

function resolvePytestArgs(rawArgs) {
  if (rawArgs.length === 0 && (process.env.UM_PYTEST_SKIP_DEFAULT ?? '0') !== '1') {
    return defaultArgs();
  }
  if (rawArgs.length === 0) {
    return [];
  }
  return rawArgs.filter((arg) => arg !== '--');
}

function main() {
  const rawArgs = process.argv.slice(2);

  if (shouldShowHelp(rawArgs)) {
    printHelp();
    process.exit(0);
  }

  const pytestArgs = resolvePytestArgs(rawArgs);
  const finalArgs = ['-m', 'pytest', ...pytestArgs];

  const result = spawnPython(finalArgs, {
    stdio: 'inherit',
    env: pythonEnv(),
  });

  ensureStatus(result);
}

main();
