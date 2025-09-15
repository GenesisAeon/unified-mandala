#!/usr/bin/env node
import { readFileSync } from 'fs';
import yaml from 'yaml';

const policyPath = 'AI_POLICY.md';
const configPath = 'config/ai-policy-sigillin.yaml';

try {
  const policyText = readFileSync(policyPath, 'utf8');
  const config = yaml.parse(readFileSync(configPath, 'utf8'));
  const missing = [];
  for (const rule of config.rules || []) {
    if (!policyText.includes(rule.note)) {
      missing.push(rule.id);
    }
  }
  if (missing.length) {
    console.error(`AI_POLICY missing notes for rules: ${missing.join(', ')}`);
    process.exit(1);
  }
  console.log('AI_POLICY compliance verified');
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error('AI_POLICY check failed:', message);
  process.exit(1);
}
