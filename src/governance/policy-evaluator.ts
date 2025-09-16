import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

export type PolicyEvent = Record<string, unknown> & {
  id?: string;
  topic?: string;
  personhood?: string;
};

export interface KyvernoPattern {
  [key: string]: unknown;
}

export interface KyvernoRule {
  name: string;
  validate?: {
    message?: string;
    pattern?: KyvernoPattern;
  };
}

export interface KyvernoSpec {
  rules?: KyvernoRule[];
}

export interface KyvernoPolicy {
  spec?: KyvernoSpec;
}

export interface PatternMismatch {
  key: string;
  expected: unknown;
  actual: unknown;
}

export interface RuleEvaluationResult {
  rule: string;
  message?: string;
  mismatches: PatternMismatch[];
}

export interface PolicyEvaluationSummary {
  matched: number;
  violations: RuleEvaluationResult[];
}

const DECORATOR_REGEX = /^\((.*)\)$/;

function stripDecorators(key: string): string {
  const trimmed = key.trim();
  const match = DECORATOR_REGEX.exec(trimmed);
  return match ? match[1] : trimmed;
}

function resolvePath(resource: Record<string, unknown>, key: string): unknown {
  const cleaned = stripDecorators(key);
  if (!cleaned) return undefined;
  const segments = cleaned.split('.');
  let current: unknown = resource;
  for (const segment of segments) {
    if (typeof current !== 'object' || current === null) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

function matchesPattern(
  resource: Record<string, unknown>,
  pattern: KyvernoPattern,
): PatternMismatch[] {
  const mismatches: PatternMismatch[] = [];
  for (const [rawKey, expected] of Object.entries(pattern)) {
    const actual = resolvePath(resource, rawKey);
    if (expected instanceof RegExp) {
      if (typeof actual !== 'string' || !expected.test(actual)) {
        mismatches.push({ key: stripDecorators(rawKey), expected, actual });
      }
      continue;
    }

    if (Array.isArray(expected)) {
      if (!Array.isArray(actual) || !expected.every((value) => actual.includes(value))) {
        mismatches.push({ key: stripDecorators(rawKey), expected, actual });
      }
      continue;
    }

    if (expected !== actual) {
      mismatches.push({ key: stripDecorators(rawKey), expected, actual });
    }
  }
  return mismatches;
}

export function evaluateRule(
  rule: KyvernoRule,
  resource: Record<string, unknown>,
): RuleEvaluationResult | undefined {
  const pattern = rule.validate?.pattern;
  if (!pattern || typeof pattern !== 'object') {
    return undefined;
  }
  const mismatches = matchesPattern(resource, pattern);
  if (mismatches.length === 0) {
    return undefined;
  }
  return {
    rule: rule.name,
    message: rule.validate?.message,
    mismatches,
  };
}

export function evaluatePolicyAgainstResource(
  policy: KyvernoPolicy,
  resource: Record<string, unknown>,
): RuleEvaluationResult[] {
  const rules = policy.spec?.rules ?? [];
  const violations: RuleEvaluationResult[] = [];
  for (const rule of rules) {
    const violation = evaluateRule(rule, resource);
    if (violation) {
      violations.push(violation);
    }
  }
  return violations;
}

export function evaluatePolicy(
  policy: KyvernoPolicy,
  resources: Array<Record<string, unknown>>,
): PolicyEvaluationSummary {
  let matched = 0;
  const violations: RuleEvaluationResult[] = [];
  for (const resource of resources) {
    const results = evaluatePolicyAgainstResource(policy, resource);
    if (results.length === 0) {
      matched += 1;
    } else {
      violations.push(...results);
    }
  }
  return { matched, violations };
}

export function normalizeEvents(input: PolicyEvent | PolicyEvent[]): PolicyEvent[] {
  return Array.isArray(input) ? input : [input];
}

export function materializeMandalaResources(
  events: PolicyEvent | PolicyEvent[],
): Record<string, unknown>[] {
  return normalizeEvents(events).map((event) => ({
    kind: 'MandalaEvent',
    ...event,
  }));
}

export function evaluateMandalaEvents(
  policy: KyvernoPolicy,
  events: PolicyEvent | PolicyEvent[],
): PolicyEvaluationSummary {
  const resources = materializeMandalaResources(events);
  return evaluatePolicy(policy, resources);
}

export function loadPolicyFromFile(policyPath: string): KyvernoPolicy {
  const raw = fs.readFileSync(policyPath, 'utf-8');
  return YAML.parse(raw) as KyvernoPolicy;
}

export function loadEventsFromFile(eventsPath: string): PolicyEvent | PolicyEvent[] {
  const absolute = path.resolve(eventsPath);
  const raw = fs.readFileSync(absolute, 'utf-8');
  return JSON.parse(raw) as PolicyEvent | PolicyEvent[];
}

export function evaluateFromFiles(policyPath: string, eventsPath: string): PolicyEvaluationSummary {
  const policy = loadPolicyFromFile(policyPath);
  const events = loadEventsFromFile(eventsPath);
  return evaluateMandalaEvents(policy, events);
}
