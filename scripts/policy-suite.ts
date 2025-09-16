import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, SpawnSyncOptions } from 'node:child_process';
import { performance } from 'node:perf_hooks';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

import type * as PolicyEvaluatorModule from '../src/governance/policy-evaluator';

export type CheckStatus = 'pass' | 'fail' | 'skipped';

export interface PolicyCheckResult {
  name: string;
  status: CheckStatus;
  durationMs: number;
  output: string[];
}

export interface PolicyCheckReport {
  generatedAt: string;
  baseRef: string;
  policyPath: string;
  eventsPath: string;
  summary: {
    pass: number;
    fail: number;
    skipped: number;
  };
  checks: PolicyCheckResult[];
}

export interface PolicySuiteOptions {
  reportPath?: string;
  baseRef?: string;
  policyPath?: string;
  eventsPath?: string;
  quiet?: boolean;
}

interface CommandOptions {
  name: string;
  command: string;
  args: string[];
  options?: SpawnSyncOptions;
}

const DEFAULT_POLICY_PATH = 'policies/kyverno.yaml';
const DEFAULT_EVENTS_PATH = 'fixtures/events/example_input.json';
const DEFAULT_REPORT_PATH = 'out/policy-report.json';
const DEFAULT_BASE_REF = 'HEAD~1';

const requireModule = createRequire(import.meta.url);
const policyEvaluator = requireModule(
  '../src/governance/policy-evaluator.js',
) as typeof PolicyEvaluatorModule;
const { evaluateMandalaEvents, loadEventsFromFile, loadPolicyFromFile } = policyEvaluator;
type PolicyEvaluationSummary = PolicyEvaluatorModule.PolicyEvaluationSummary;
type PatternMismatch = PolicyEvaluatorModule.PatternMismatch;

function toMilliseconds(start: number, end: number): number {
  return Math.round((end - start) * 1000) / 1000;
}

function runCommand({ name, command, args, options }: CommandOptions): PolicyCheckResult {
  const started = performance.now();
  try {
    const result = spawnSync(command, args, {
      encoding: 'utf-8',
      stdio: 'pipe',
      ...options,
    });

    const durationMs = toMilliseconds(started, performance.now());
    if (result.error && (result.error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {
        name,
        status: 'skipped',
        durationMs,
        output: [`${command} not available`],
      };
    }

    const output = [] as string[];
    const stdout =
      typeof result.stdout === 'string' ? result.stdout : result.stdout?.toString('utf-8');
    const stderr =
      typeof result.stderr === 'string' ? result.stderr : result.stderr?.toString('utf-8');

    if (stdout?.trim()) {
      output.push(stdout.trim());
    }
    if (stderr?.trim()) {
      output.push(stderr.trim());
    }

    const status: CheckStatus = result.status === 0 ? 'pass' : 'fail';
    return { name, status, durationMs, output };
  } catch (error) {
    const durationMs = toMilliseconds(started, performance.now());
    return {
      name,
      status: 'fail',
      durationMs,
      output: [(error as Error).message],
    };
  }
}

function formatKyvernoSummary(summary: PolicyEvaluationSummary): string[] {
  if (summary.violations.length === 0) {
    return [`Matched ${summary.matched} resource(s)`];
  }
  const details: string[] = [];
  for (const violation of summary.violations) {
    const mismatches = violation.mismatches
      .map(
        (mismatch: PatternMismatch) =>
          `${mismatch.key}: expected ${mismatch.expected} got ${mismatch.actual}`,
      )
      .join(', ');
    const message = violation.message ? `${violation.message} – ${mismatches}` : mismatches;
    details.push(`${violation.rule}: ${message}`);
  }
  return details;
}

function runKyvernoDryRun(policyPath: string, eventsPath: string): PolicyCheckResult {
  const started = performance.now();
  try {
    const policy = loadPolicyFromFile(policyPath);
    const events = loadEventsFromFile(eventsPath);
    const evaluation = evaluateMandalaEvents(policy, events);
    const durationMs = toMilliseconds(started, performance.now());
    const output = formatKyvernoSummary(evaluation);
    const status: CheckStatus = evaluation.violations.length === 0 ? 'pass' : 'fail';
    return { name: 'kyverno', status, durationMs, output };
  } catch (error) {
    const durationMs = toMilliseconds(started, performance.now());
    return {
      name: 'kyverno',
      status: 'fail',
      durationMs,
      output: [(error as Error).message],
    };
  }
}

function runOpaCheck(): PolicyCheckResult {
  return runCommand({ name: 'opa', command: 'node', args: ['tools/opa-check.mjs'] });
}

function runGuardrails(baseRef: string): PolicyCheckResult {
  return runCommand({
    name: 'guardrails',
    command: 'node',
    args: ['tools/governance-guardrails.mjs'],
    options: {
      env: { ...process.env, POLICY_GIT_BASE: baseRef },
    },
  });
}

function buildSummary(checks: PolicyCheckResult[]) {
  return checks.reduce(
    (acc, check) => {
      acc[check.status] += 1;
      return acc;
    },
    { pass: 0, fail: 0, skipped: 0 } as Record<CheckStatus, number>,
  );
}

export function collectPolicyChecks(options: PolicySuiteOptions = {}): PolicyCheckReport {
  const policyPath = options.policyPath ?? DEFAULT_POLICY_PATH;
  const eventsPath = options.eventsPath ?? DEFAULT_EVENTS_PATH;
  const baseRef = options.baseRef ?? process.env.POLICY_GIT_BASE ?? DEFAULT_BASE_REF;

  const checks: PolicyCheckResult[] = [];
  checks.push(runOpaCheck());
  checks.push(runKyvernoDryRun(policyPath, eventsPath));
  checks.push(runGuardrails(baseRef));

  const summaryCounts = buildSummary(checks);
  return {
    generatedAt: new Date().toISOString(),
    baseRef,
    policyPath,
    eventsPath,
    summary: {
      pass: summaryCounts.pass,
      fail: summaryCounts.fail,
      skipped: summaryCounts.skipped,
    },
    checks,
  };
}

function ensureDirectory(targetPath: string) {
  const directory = path.dirname(targetPath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

export function writePolicyReport(report: PolicyCheckReport, targetPath: string) {
  ensureDirectory(targetPath);
  fs.writeFileSync(targetPath, `${JSON.stringify(report, null, 2)}\n`, 'utf-8');
}

function printReport(report: PolicyCheckReport) {
  console.log(`Policy suite executed at ${report.generatedAt}`);
  console.log(`Base ref: ${report.baseRef}`);
  console.log(`Policy: ${report.policyPath}`);
  console.log(`Events: ${report.eventsPath}`);
  console.table(
    report.checks.map((check) => ({
      check: check.name,
      status: check.status,
      duration_ms: check.durationMs,
      details: check.output.join(' | '),
    })),
  );
  console.log(
    `Summary → pass: ${report.summary.pass}, fail: ${report.summary.fail}, skipped: ${report.summary.skipped}`,
  );
}

function parseArgs(argv: string[]): PolicySuiteOptions {
  const options: PolicySuiteOptions = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--report' && argv[i + 1]) {
      options.reportPath = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === '--base-ref' && argv[i + 1]) {
      options.baseRef = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === '--policy' && argv[i + 1]) {
      options.policyPath = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === '--events' && argv[i + 1]) {
      options.eventsPath = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === '--quiet') {
      options.quiet = true;
      continue;
    }
  }
  return options;
}

export function runCli(argv: string[] = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const reportPath = args.reportPath ?? DEFAULT_REPORT_PATH;
  const report = collectPolicyChecks(args);
  writePolicyReport(report, reportPath);
  if (!args.quiet) {
    printReport(report);
  }

  if (report.summary.fail > 0) {
    process.exitCode = 1;
  }
}

const entryPointUrl = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (entryPointUrl === import.meta.url) {
  runCli();
}
