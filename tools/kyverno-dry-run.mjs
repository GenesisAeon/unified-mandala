#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import YAML from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

function usage() {
  console.log(`Kyverno dry-run fallback\n\n` +
    `Usage: node tools/kyverno-dry-run.mjs [--policy <path>] [--resource <path>] [--kind <kind>]`);
}

const options = {
  policy: 'policies/kyverno.yaml',
  resource: 'fixtures/events/example_input.json',
  kind: process.env.KYVERNO_RESOURCE_KIND || 'MandalaEvent',
};

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === '--policy' && typeof args[i + 1] === 'string') {
    options.policy = args[i + 1];
    i += 1;
  } else if (arg === '--resource' && typeof args[i + 1] === 'string') {
    options.resource = args[i + 1];
    i += 1;
  } else if (arg === '--kind' && typeof args[i + 1] === 'string') {
    options.kind = args[i + 1];
    i += 1;
  } else if (arg === '--help' || arg === '-h') {
    usage();
    process.exit(0);
  } else {
    console.warn(`Unknown argument: ${arg}`);
    usage();
    process.exit(1);
  }
}

const policyPath = path.isAbsolute(options.policy)
  ? options.policy
  : path.join(projectRoot, options.policy);
const resourcePath = path.isAbsolute(options.resource)
  ? options.resource
  : path.join(projectRoot, options.resource);

function readPolicyDocuments(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`Policy file not found: ${file}`);
  }
  const raw = fs.readFileSync(file, 'utf-8');
  return YAML.parseAllDocuments(raw)
    .map((doc) => doc.toJSON())
    .filter(Boolean);
}

function readResource(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`Resource file not found: ${file}`);
  }
  const raw = fs.readFileSync(file, 'utf-8');
  const ext = path.extname(file).toLowerCase();
  let data;
  if (ext === '.yaml' || ext === '.yml') {
    data = YAML.parse(raw);
  } else {
    data = JSON.parse(raw);
  }
  if (typeof data !== 'object' || data === null) {
    throw new Error('Resource fixture must be an object.');
  }
  return data;
}

function normalizeResource(resource) {
  const normalized = { ...resource };
  normalized.apiVersion = normalized.apiVersion || 'mandala.ai/v1';
  normalized.kind = normalized.kind || options.kind || 'MandalaEvent';
  normalized.metadata = normalized.metadata || {};
  if (!normalized.metadata.name) {
    normalized.metadata.name = resource.id || 'kyverno-fixture';
  }
  return normalized;
}

function collectKeysState() {
  const keysDir = path.join(projectRoot, 'keys');
  const allowed = ['.gitignore', '.gitkeep'];
  const state = {
    present: false,
    files: [],
    unexpected: [],
    allowed,
  };
  if (!fs.existsSync(keysDir) || !fs.statSync(keysDir).isDirectory()) {
    return state;
  }
  state.present = true;
  const entries = fs.readdirSync(keysDir, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort();
  state.files = files;
  state.unexpected = files.filter((name) => !allowed.includes(name));
  const directories = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  if (directories.length > 0) {
    state.unexpected.push(...directories.map((dir) => `${dir}/`));
    state.unexpected.sort();
  }
  return state;
}

function enrichResource(resource) {
  const enriched = { ...resource };
  enriched.repo = enriched.repo || {};
  enriched.repo.keys = collectKeysState();
  return enriched;
}

function matchesKind(ruleMatch, resource) {
  if (!ruleMatch) {
    return true;
  }
  const candidates = [];
  if (Array.isArray(ruleMatch.any)) {
    candidates.push(...ruleMatch.any);
  }
  if (Array.isArray(ruleMatch.all)) {
    candidates.push(...ruleMatch.all);
  }
  if (candidates.length === 0) {
    candidates.push(ruleMatch);
  }
  const resourceKind = resource.kind;
  return candidates.some((candidate) => {
    if (candidate && candidate.resources && Array.isArray(candidate.resources.kinds)) {
      return candidate.resources.kinds.includes(resourceKind);
    }
    return true;
  });
}

function collectPatternFailures(pattern, resource, pathSegments = []) {
  const failures = [];
  if (pattern === null || typeof pattern !== 'object' || Array.isArray(pattern)) {
    if (pattern !== resource) {
      failures.push({
        path: pathSegments.join('.'),
        expected: pattern,
        actual: resource,
      });
    }
    return failures;
  }

  for (const [rawKey, expectedValue] of Object.entries(pattern)) {
    const key = rawKey.startsWith('(') && rawKey.endsWith(')')
      ? rawKey.slice(1, -1)
      : rawKey;
    const actualValue = resource ? resource[key] : undefined;
    const nextPath = [...pathSegments, key];
    if (Array.isArray(expectedValue)) {
      if (!Array.isArray(actualValue)) {
        failures.push({ path: nextPath.join('.'), expected: expectedValue, actual: actualValue });
      } else {
        const missing = expectedValue.filter((item) => !actualValue.includes(item));
        if (missing.length > 0) {
          failures.push({ path: nextPath.join('.'), expected: expectedValue, actual: actualValue });
        }
      }
    } else if (expectedValue && typeof expectedValue === 'object') {
      failures.push(...collectPatternFailures(expectedValue, actualValue, nextPath));
    } else if (actualValue !== expectedValue) {
      failures.push({ path: nextPath.join('.'), expected: expectedValue, actual: actualValue });
    }
  }
  return failures;
}

function evaluatePolicyDocuments(policies, resource) {
  const messages = [];
  let failed = false;

  policies.forEach((policy) => {
    if (!policy || !policy.spec || !Array.isArray(policy.spec.rules)) {
      return;
    }
    policy.spec.rules.forEach((rule) => {
      const ruleName = rule.name || 'unnamed-rule';
      if (!matchesKind(rule.match, resource)) {
        messages.push(`ℹ️  Rule ${ruleName} skipped (kind ${resource.kind} not targeted).`);
        return;
      }
      const pattern = rule.validate && rule.validate.pattern;
      if (!pattern) {
        messages.push(`ℹ️  Rule ${ruleName} has no validate.pattern – skipping.`);
        return;
      }
      const failures = collectPatternFailures(pattern, resource);
      if (failures.length > 0) {
        failed = true;
        const header = rule.validate && rule.validate.message
          ? `${rule.validate.message}`
          : `Rule ${ruleName} violated.`;
        messages.push(`❌ ${header}`);
        failures.forEach((failure) => {
          messages.push(
            `   • ${failure.path || '<root>'}: expected ${JSON.stringify(failure.expected)},` +
              ` received ${JSON.stringify(failure.actual)}`,
          );
        });
      } else {
        messages.push(`✅ Rule ${ruleName} satisfied.`);
      }
    });
  });

  return { failed, messages };
}

async function main() {
  try {
    const policies = readPolicyDocuments(policyPath);
    if (policies.length === 0) {
      console.log('No Kyverno policies found – marking as skipped.');
      return;
    }
    const rawResource = readResource(resourcePath);
    const resource = enrichResource(normalizeResource(rawResource));
    const { failed, messages } = evaluatePolicyDocuments(policies, resource);
    messages.forEach((line) => console.log(line));
    if (failed) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('Kyverno dry-run failed:', error.message || error);
    process.exitCode = 1;
  }
}

await main();
