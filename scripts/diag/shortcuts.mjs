#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

function run(command, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? repoRoot,
      env: options.env ?? process.env,
      shell: options.shell ?? process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
      if (options.forwardStdout) {
        process.stdout.write(chunk);
      }
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk;
      if (options.forwardStderr || options.forwardStdout) {
        process.stderr.write(chunk);
      }
    });

    child.on('error', (error) => {
      resolve({ code: null, stdout, stderr, error });
    });

    child.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

function extractJson(text) {
  const lines = text.trim().split(/\r?\n/).reverse();
  for (const line of lines) {
    const candidate = line.trim();
    if (!candidate) continue;
    try {
      return JSON.parse(candidate);
    } catch (error) {
      continue;
    }
  }
  return null;
}

function printStatus(label, status, note) {
  const symbol =
    status === 'pass' ? '✓' : status === 'warn' ? '⚠️' : status === 'skip' ? '⏭️' : '❌';
  const hint = note ? ` – ${note}` : '';
  console.log(`${symbol} ${label}${hint}`);
}

async function runPwshDiagnostic() {
  const commands = ['pwsh', 'powershell'];
  for (const cmd of commands) {
    const result = await run(cmd, [
      '-NoLogo',
      '-NoProfile',
      '-Command',
      '. ./scripts/dev-helper.ps1; Test-UM -Diagnostic',
    ]);

    if (result.error && result.error.code === 'ENOENT') {
      continue;
    }

    if (result.code === 0) {
      return { status: 'pass', command: cmd, result };
    }

    return {
      status: 'fail',
      command: cmd,
      result,
    };
  }

  return {
    status: 'skip',
    command: null,
    result: { stdout: '', stderr: '', code: null },
    reason: 'PowerShell (pwsh/powershell) not available in PATH',
  };
}

const summary = {
  timestamp: new Date().toISOString(),
  checks: [],
};

console.log('Unified Mandala · Shortcut Diagnostics');
console.log('---------------------------------------');

// 1) Dev stack diagnostic
const devServices = await run('node', ['scripts/dev-services.mjs', '--diagnostic', '--diag-json'], {
  env: {
    ...process.env,
    UM_DEV_SERVICES_DIAG: '1',
    UM_DEV_SERVICES_DIAG_JSON: '1',
  },
});
const devServicesJson = extractJson(devServices.stdout);
const devStatus = devServices.code === 0 ? 'pass' : 'fail';
printStatus(
  'dev-services.mjs diagnostic',
  devStatus,
  devStatus === 'pass' ? undefined : 'Port conflicts or missing prebuilds detected',
);
summary.checks.push({
  id: 'dev-stack',
  label: 'Dev stack diagnostic',
  command: 'node scripts/dev-services.mjs --diagnostic --diag-json',
  status: devStatus,
  exitCode: devServices.code,
  details: devServicesJson ?? {
    note: 'No diagnostic JSON emitted',
    stdout: devServices.stdout.trim(),
    stderr: devServices.stderr.trim(),
  },
});

// 2) Live smoke (soft)
const liveSmoke = await run(
  'node',
  ['scripts/smoke/live-smoke.mjs', '--json', '--soft', '--diagnostic'],
  {},
);
const liveJson = extractJson(liveSmoke.stdout);
const liveStatus = liveJson && liveJson.ok ? 'pass' : 'warn';
printStatus(
  'live-smoke (health + /api/ai/chat)',
  liveStatus,
  liveStatus === 'pass' ? undefined : 'Start dev stack or set UI_DEV_URL before rerunning',
);
summary.checks.push({
  id: 'smoke-live',
  label: 'Live smoke (health + chat)',
  command: 'node scripts/smoke/live-smoke.mjs --json --soft --diagnostic',
  status: liveStatus,
  exitCode: liveSmoke.code,
  details: liveJson ?? {
    note: 'Smoke output missing',
    stdout: liveSmoke.stdout.trim(),
    stderr: liveSmoke.stderr.trim(),
  },
});

// 3) PowerShell helper availability
const pwsh = await runPwshDiagnostic();
if (pwsh.status === 'pass') {
  printStatus('PowerShell Test-UM (-Diagnostic)', 'pass');
} else if (pwsh.status === 'skip') {
  printStatus('PowerShell Test-UM (-Diagnostic)', 'skip', pwsh.reason);
} else {
  printStatus(
    'PowerShell Test-UM (-Diagnostic)',
    'fail',
    'Check execution policy / pwsh availability',
  );
}
summary.checks.push({
  id: 'powershell-test-um',
  label: 'PowerShell Test-UM diagnostic',
  command: pwsh.command
    ? `${pwsh.command} -NoLogo -NoProfile -Command ". ./scripts/dev-helper.ps1; Test-UM -Diagnostic"`
    : 'pwsh/powershell not found',
  status: pwsh.status,
  exitCode: pwsh.result.code,
  details: {
    stdout: pwsh.result.stdout.trim(),
    stderr: pwsh.result.stderr.trim(),
    error: pwsh.reason ?? (pwsh.result.error ? pwsh.result.error.message : undefined),
  },
});

console.log('\nJSON summary:');
console.log(JSON.stringify(summary, null, 2));

const hasFailure = summary.checks.some((item) => item.status === 'fail');
process.exit(hasFailure ? 1 : 0);
