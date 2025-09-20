#!/usr/bin/env node
import chokidar from 'chokidar';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const WATCH_PATHS = ['sigils', 'apps/ui', 'scripts'];
const DASHBOARD_PATH = path.resolve('analysis/trikaya-dashboard.json');
const CREP_MIN = Number.parseFloat(process.env.BREATH_CREP_MIN ?? '0.85');

const log = (...args) => console.log('\n🌬️  emergence-breath:', ...args);
const warn = (...args) => console.warn('\n⚠️  emergence-breath:', ...args);
const error = (...args) => console.error('\n⛔  emergence-breath:', ...args);

function runPnpm(command, args = []) {
  return new Promise((resolve, reject) => {
    const bin = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
    const child = spawn(bin, [command, ...args], {
      stdio: 'inherit',
      env: process.env,
      shell: process.platform === 'win32',
    });
    child.on('error', (err) => {
      reject(err);
    });
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });
}

let busy = false;
let pending = false;

async function analyseDashboard() {
  try {
    const raw = fs.readFileSync(DASHBOARD_PATH, 'utf8');
    const dashboard = JSON.parse(raw);
    const providers = Array.isArray(dashboard?.providers) ? dashboard.providers : [];
    if (providers.length === 0) {
      warn('Trikāya dashboard contains no providers yet.');
      return;
    }

    const fullTrikaya = (record) => {
      const layer = record?.trikaya ?? {};
      return ['dharmakāya', 'sambhogakāya', 'nirmāṇakāya'].every((key) => Boolean(layer?.[key]));
    };

    const metrics = providers.reduce(
      (acc, provider) => {
        if (typeof provider?.averageCREP === 'number' && fullTrikaya(provider)) {
          acc.covered += 1;
          if (provider.averageCREP >= CREP_MIN) {
            acc.crepAligned += 1;
          }
        }
        if (provider?.nextActionRule) {
          acc.nextAction += 1;
        }
        return acc;
      },
      { covered: 0, crepAligned: 0, nextAction: 0 },
    );

    const total = providers.length;
    log(
      `✨ Providers with full Trikāya coverage: ${metrics.covered}/${total} · ` +
        `CREP≥${CREP_MIN.toFixed(2)}: ${metrics.crepAligned}/${total} · ` +
        `Next action ready: ${metrics.nextAction}/${total}`,
    );
  } catch (err) {
    warn(`Unable to read dashboard at ${DASHBOARD_PATH}: ${err.message}`);
  }
}

async function cycle() {
  if (busy) {
    pending = true;
    return;
  }
  busy = true;
  try {
    log('validate → trikāya dashboard');
    await runPnpm('validate:sigillins');
    await runPnpm('trikaya:dashboard');
    await analyseDashboard();
  } catch (err) {
    error(err.message);
  } finally {
    busy = false;
    if (pending) {
      pending = false;
      setImmediate(cycle);
    }
  }
}

const watcher = chokidar.watch(WATCH_PATHS, {
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 200,
    pollInterval: 100,
  },
});

watcher.on('all', (event, filePath) => {
  log(`change detected (${event}): ${filePath}`);
  cycle();
});

watcher.on('error', (err) => {
  error(`Watcher error: ${err.message}`);
});

log(`watching ${WATCH_PATHS.join(', ')} (Ctrl+C to stop)`);
cycle();

const shutdown = (signal) => {
  warn(`received ${signal}, shutting down watcher`);
  watcher
    .close()
    .catch((err) => error(`Failed to close watcher: ${err.message}`))
    .finally(() => {
      process.exit(signal === 'SIGINT' ? 130 : 143);
    });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
