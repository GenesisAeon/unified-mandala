#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'out', 'policy');
fs.mkdirSync(outputDir, { recursive: true });
const defaultSigillinDir = path.join('out', 'policy', 'sigillins');
const sigillinReportDir = path.join(outputDir, 'sigillins');
const sigillinReportRelRaw = path.relative(projectRoot, sigillinReportDir);
const sigillinReportRel =
  sigillinReportRelRaw && sigillinReportRelRaw !== '' ? sigillinReportRelRaw : defaultSigillinDir;
const sigillinReportDisplay = sigillinReportRel.split(path.sep).join('/');

const inputPath = process.env.POLICY_SUITE_INPUT || 'fixtures/events/example_input.json';
const resolvedInputPath = path.isAbsolute(inputPath)
  ? inputPath
  : path.join(projectRoot, inputPath);
const kyvernoScript = path.join(projectRoot, 'tools', 'kyverno-dry-run.mjs');
const kyvernoPolicyPath = path.join(projectRoot, 'policies', 'kyverno.yaml');

const checks = [
  {
    name: 'OPA Governance',
    command: () => ({
      cmd: 'node',
      args: ['tools/opa-check.mjs', inputPath],
    }),
    successNote: 'OPA policy returned allow=true',
    failureHint: 'OPA denied the input fixture. Inspect policies/governance.rego',
    interpret: (result, ctx) => {
      if (result.status !== 'passed') {
        return;
      }
      try {
        const logAbsolute = path.isAbsolute(ctx.logPath)
          ? ctx.logPath
          : path.join(projectRoot, ctx.logPath);
        const logText = fs.readFileSync(logAbsolute, 'utf-8');
        const normalized = logText.toLowerCase();
        const allowTrue =
          normalized.includes('allow=true') || normalized.includes('policy allow=true');
        const skipped = normalized.includes('skipping');
        if (skipped && !allowTrue) {
          result.status = 'skipped';
          result.notes = 'OPA binary or Docker image unavailable – dry-run skipped.';
        }
      } catch (error) {
        console.warn(`Unable to read OPA log at ${ctx.logPath}:`, error);
      }
    },
  },
  {
    name: 'Guardrails',
    command: () => ({
      cmd: 'node',
      args: ['tools/governance-guardrails.mjs'],
    }),
    successNote: 'Repository guardrails satisfied (no policy drift detected)',
    failureHint: 'Guardrails flagged the latest commit. Review policies/merge-guardrails.yaml',
  },
  {
    name: 'Kyverno Dry-Run',
    skip: () => {
      const flag = (process.env.POLICY_SUITE_SKIP_KYVERNO || '').toLowerCase();
      return flag === '1' || flag === 'true';
    },
    skipNote: 'Kyverno validation skipped via POLICY_SUITE_SKIP_KYVERNO',
    command: () => ({
      cmd: 'node',
      args: [
        kyvernoScript,
        '--policy',
        path.relative(projectRoot, kyvernoPolicyPath),
        '--resource',
        path.relative(projectRoot, resolvedInputPath),
      ],
    }),
    successNote: 'Kyverno policies accepted the example fixture',
    failureHint:
      'Kyverno denied the input fixture. Inspect policies/kyverno.yaml or fixtures/events/example_input.json',
  },
  {
    name: 'Sigillin Governance',
    skip: () => {
      const flag = (process.env.POLICY_SUITE_SKIP_SIGILLINS || '').toLowerCase();
      return flag === '1' || flag === 'true';
    },
    skipNote: 'Sigillin report skipped via POLICY_SUITE_SKIP_SIGILLINS',
    command: () => ({
      cmd: 'pnpm',
      args: ['sigillins:report', '--out-dir', sigillinReportRel],
    }),
    successNote: `Sigillin governance reports saved to ${sigillinReportDisplay}`,
    failureHint: `Sigillin report failed – inspect ${sigillinReportDisplay} for Markdown/JUnit output.`,
  },
];

const results = [];
let hasFailure = false;

function sanitize(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function tailBuffer() {
  let buffer = '';
  return {
    push(chunk) {
      buffer = `${buffer}${chunk}`;
      if (buffer.length > 4000) {
        buffer = buffer.slice(-4000);
      }
    },
    value() {
      const trimmed = buffer.trim();
      if (!trimmed) {
        return '';
      }
      const lines = trimmed.split(/\r?\n/);
      return lines.slice(-8).join('\n');
    },
  };
}

async function runCheck(definition) {
  const { name, command, successNote, failureHint } = definition;
  if (typeof definition.skip === 'function' && definition.skip()) {
    const note = definition.skipNote || 'Skipped by configuration.';
    results.push({
      name,
      status: 'skipped',
      logPath: null,
      notes: note,
      durationMs: 0,
    });
    return;
  }
  const resolved = typeof command === 'function' ? command() : command;
  const logFileName = `${sanitize(name) || 'policy-check'}.log`;
  const logPath = path.join(outputDir, logFileName);
  const logStream = fs.createWriteStream(logPath, { flags: 'w' });
  const start = Date.now();
  const buffer = tailBuffer();

  const child = spawn(resolved.cmd, resolved.args, {
    cwd: projectRoot,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let spawnError;
  child.stdout.on('data', (data) => {
    process.stdout.write(data);
    logStream.write(data);
    buffer.push(data.toString());
  });
  child.stderr.on('data', (data) => {
    process.stderr.write(data);
    logStream.write(data);
    buffer.push(data.toString());
  });
  child.on('error', (err) => {
    spawnError = err;
  });

  const exitCode = await new Promise((resolve) => {
    child.on('close', (code) => {
      resolve(typeof code === 'number' ? code : 1);
    });
  });

  logStream.end();
  const durationMs = Date.now() - start;
  const tailText = buffer.value();

  const result = {
    name,
    status: exitCode === 0 ? 'passed' : 'failed',
    logPath: path.relative(projectRoot, logPath),
    durationMs,
  };

  if (exitCode === 0) {
    if (successNote) {
      result.notes = successNote;
    }
  } else {
    hasFailure = true;
    if (spawnError) {
      result.notes = spawnError.message;
    } else if (tailText) {
      result.notes = tailText;
    } else {
      result.notes = `Exit code ${exitCode}`;
    }
    if (failureHint) {
      result.notes = result.notes ? `${result.notes} | ${failureHint}` : failureHint;
    }
  }

  if (typeof definition.interpret === 'function') {
    definition.interpret(result, { tail: tailText, logPath });
  }

  results.push(result);
}

async function main() {
  for (const check of checks) {
    try {
      await runCheck(check);
    } catch (err) {
      hasFailure = true;
      results.push({
        name: check.name,
        status: 'failed',
        logPath: null,
        notes: err instanceof Error ? err.message : String(err),
      });
    }
  }
}

await main();

const artifacts = {
  sigillins: {
    reportDir: sigillinReportDisplay,
    junit: `${sigillinReportDisplay}/sigillins-junit-report.xml`,
    markdown: `${sigillinReportDisplay}/sigillins-report.md`,
  },
};

const payload = {
  generatedAt: new Date().toISOString(),
  input: path.relative(projectRoot, resolvedInputPath),
  results,
  artifacts,
};

const jsonPath = path.join(outputDir, 'policy-suite.json');
fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2));
console.log(`\nPolicy suite results written to ${path.relative(projectRoot, jsonPath)}`);

if (hasFailure) {
  process.exitCode = 1;
}
