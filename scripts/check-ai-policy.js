#!/usr/bin/env node
const fs = require('fs');
const yaml = require('yaml');

const policyPath = 'AI_POLICY.md';
const configPath = 'config/ai-policy-sigillin.yaml';

try {
  const policyText = fs.readFileSync(policyPath, 'utf8');
  const config = yaml.parse(fs.readFileSync(configPath, 'utf8'));
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
  console.error('AI_POLICY check failed:', err.message);
  process.exit(1);
}
