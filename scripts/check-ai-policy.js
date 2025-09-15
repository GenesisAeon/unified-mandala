#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import yaml from "yaml";

const policyPath = resolve(process.cwd(), "AI_POLICY.md");
const configPath = resolve(process.cwd(), "config/ai-policy-sigillin.yaml");

try {
  const policyText = readFileSync(policyPath, "utf8");
  const configRaw = readFileSync(configPath, "utf8");
  const config = yaml.parse(configRaw) ?? {};
  const missing = [];
  for (const rule of config.rules ?? []) {
    if (rule?.note && !policyText.includes(rule.note)) {
      missing.push(String(rule.id ?? rule.note));
    }
  }
  if (missing.length > 0) {
    console.error(`AI_POLICY missing notes for rules: ${missing.join(", ")}`);
    process.exit(1);
  }
  console.log("AI_POLICY compliance verified");
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error("AI_POLICY check failed:", message);
  process.exit(1);
}
