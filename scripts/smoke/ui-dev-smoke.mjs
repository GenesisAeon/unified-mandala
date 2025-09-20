import http from 'node:http';
import https from 'node:https';
import { spawn } from 'node:child_process';
import process from 'node:process';
import { URL } from 'node:url';

const LOG_PREFIX = '[smoke:ui]';
const DEFAULT_TIMEOUT_MS = Number(process.env.UI_DEV_TIMEOUT ?? '30000');
const DEFAULT_INITIAL_DELAY_MS = Number(process.env.UI_DEV_INITIAL_DELAY ?? '1500');
const DEFAULT_POLL_INTERVAL_MS = Number(process.env.UI_DEV_POLL_INTERVAL ?? '750');

function stripAnsi(text) {
  const escapePrefix = `${String.fromCharCode(27)}[`;
  const segments = text.split(escapePrefix);
  if (segments.length === 1) {
    return text;
  }
  let result = segments[0];
  for (let i = 1; i < segments.length; i += 1) {
    const segment = segments[i];
    const closingIndex = segment.indexOf('m');
    if (closingIndex === -1) {
      result += segment;
    } else {
      result += segment.slice(closingIndex + 1);
    }
  }
  return result;
}

function parseUrl(raw) {
  if (!raw) return null;
  let candidate = raw.trim();
  if (!candidate) return null;
  candidate = stripAnsi(candidate);
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `http://${candidate}`;
  }
  try {
    const url = new URL(candidate);
    if (!url.pathname) {
      url.pathname = '/';
    }
    return url;
  } catch {
    return null;
  }
}

function log(message) {
  console.log(`${LOG_PREFIX} ${message}`);
}

function logError(message) {
  console.error(`${LOG_PREFIX} ${message}`);
}

const child = spawn('pnpm', ['-s', 'dev:ui'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  env: process.env,
  shell: process.platform === 'win32',
});

let resolvedUrl = null;
let fallbackCandidate = null;
let fallbackTimer = null;
let pollTimer = null;
let timeoutTimer = null;
let finished = false;

function clearTimers() {
  if (pollTimer) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }
  if (timeoutTimer) {
    clearTimeout(timeoutTimer);
    timeoutTimer = null;
  }
  if (fallbackTimer) {
    clearTimeout(fallbackTimer);
    fallbackTimer = null;
  }
}

function schedulePoll(delay = DEFAULT_POLL_INTERVAL_MS) {
  if (finished || !resolvedUrl) return;
  if (pollTimer) clearTimeout(pollTimer);
  pollTimer = setTimeout(checkServer, delay);
}

function finish(code, message) {
  if (finished) return;
  finished = true;
  clearTimers();
  if (message) {
    if (code === 0) {
      log(message);
    } else {
      logError(message);
    }
  }
  try {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  } catch {
    // ignore
  }
  setTimeout(() => {
    process.exit(code);
  }, 500);
}

function beginPolling(url, reason) {
  if (resolvedUrl || finished) return;
  resolvedUrl = url;
  clearTimers();
  log(`Waiting for ${resolvedUrl.href} (${reason})`);
  timeoutTimer = setTimeout(() => {
    finish(4, `Timeout: UI dev server not ready (${resolvedUrl.href})`);
  }, DEFAULT_TIMEOUT_MS);
  schedulePoll(DEFAULT_INITIAL_DELAY_MS);
}

function checkServer() {
  if (!resolvedUrl || finished) return;
  const client = resolvedUrl.protocol === 'https:' ? https : http;
  const request = client.get(resolvedUrl, (response) => {
    response.resume();
    const status = response.statusCode ?? 0;
    if (status >= 200 && status < 400) {
      finish(0, `UI dev server ready at ${resolvedUrl.href}`);
    } else {
      schedulePoll();
    }
  });
  request.on('error', () => {
    schedulePoll();
  });
}

const override = (process.env.UI_DEV_URL ?? '').trim();
if (override) {
  const parsed = parseUrl(override);
  if (!parsed) {
    finish(1, `Invalid UI_DEV_URL override: ${override}`);
  } else {
    log(`Using UI_DEV_URL override: ${parsed.href}`);
    beginPolling(parsed, 'UI_DEV_URL');
  }
}

child.stdout.setEncoding('utf8');
child.stdout.on('data', (chunk) => {
  process.stdout.write(chunk);
  if (override || resolvedUrl || finished) {
    return;
  }
  const matches = stripAnsi(chunk).match(/https?:\/\/[^\s]+/g);
  if (!matches) return;
  let networkCandidate = null;
  for (const raw of matches) {
    const candidate = parseUrl(raw);
    if (!candidate) continue;
    const hostname = candidate.hostname.toLowerCase();
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      beginPolling(candidate, 'vite-output');
      return;
    }
    if (!networkCandidate) {
      networkCandidate = candidate;
    }
  }
  if (networkCandidate && !fallbackCandidate) {
    fallbackCandidate = networkCandidate;
    fallbackTimer = setTimeout(() => {
      if (!resolvedUrl && fallbackCandidate && !finished) {
        beginPolling(fallbackCandidate, 'vite-network');
      }
    }, 300);
  }
});

child.stderr.setEncoding('utf8');
child.stderr.on('data', (chunk) => {
  process.stderr.write(chunk);
});

child.on('exit', (code, signal) => {
  if (finished) return;
  if (signal) {
    finish(1, `Dev server terminated due to ${signal}`);
    return;
  }
  const exitCode = code ?? 1;
  finish(exitCode, `Dev server exited with code ${exitCode}`);
});

process.on('SIGINT', () => {
  finish(130, 'Received SIGINT');
});

process.on('SIGTERM', () => {
  finish(143, 'Received SIGTERM');
});
