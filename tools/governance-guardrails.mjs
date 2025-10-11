import 'dotenv/config';
import fs from 'fs';
import YAML from 'yaml';
import cp from 'child_process';
const cfgPath = 'policies/merge-guardrails.yaml';
if (!fs.existsSync(cfgPath)) {
  console.log('No guardrails config');
  process.exit(0);
}
const cfg = YAML.parse(fs.readFileSync(cfgPath, 'utf-8'));
let ok = true;
const git = (cmd) => cp.execSync(cmd, { encoding: 'utf-8' });
const touched = git(`git diff --name-only HEAD~1..HEAD`).split('\n').filter(Boolean);

function requiresDocForPolicyChange() {
  const policyTouched = touched.some((f) => f.startsWith('policies/personhood-levels'));
  if (policyTouched) {
    const docsTouched =
      touched.some((f) => f.startsWith('docs/')) ||
      touched.includes('README.md') ||
      touched.includes('Handbuch.md');
    if (!docsTouched) {
      console.error('[Guardrail] Policy change without docs');
      ok = false;
    }
  }
}
function requireIssueForGateWidening() {
  const files = ['policies/personhood-levels.yaml', 'policies/personhood-levels.json'].filter((f) =>
    touched.includes(f),
  );
  for (const f of files) {
    const txt = fs.readFileSync(f, 'utf-8');
    if (/min_level:\s*P0|admin\.*/.test(txt)) {
      const msg = git(`git log -1 --pretty=%B`);
      if (!/#\d+/.test(msg)) {
        console.error('[Guardrail] Gate widening without issue ref');
        ok = false;
      }
    }
  }
}
function envSecretsPresent() {
  if (
    touched.includes('tools/llm/send-claude.mjs') ||
    touched.includes('tools/llm/send-mistral.mjs')
  ) {
    if (!process.env.ANTHROPIC_API_KEY || !process.env.MISTRAL_API_KEY) {
      console.error('[Guardrail] Missing API keys (.env not set)');
      ok = false;
    }
  }
}
requiresDocForPolicyChange();
requireIssueForGateWidening();
envSecretsPresent();
process.exit(ok ? 0 : 1);
