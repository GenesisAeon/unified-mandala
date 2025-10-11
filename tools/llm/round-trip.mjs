import 'dotenv/config';
import { spawnSync } from 'child_process';
import { mkdirSync } from 'fs';
const run = (c, a, e = {}) => {
  const r = spawnSync(c, a, { stdio: 'inherit', env: { ...process.env, ...e } });
  if (r.status !== 0) throw new Error(`${c} ${a.join(' ')} failed`);
};

mkdirSync('feedback', { recursive: true });
run('node', [
  'tools/llm/send-claude.mjs',
  'tools/llm-review-prompts/claude.md',
  'feedback/claude.md',
]);
run('node', [
  'tools/llm/send-mistral.mjs',
  'tools/llm-review-prompts/mistral.md',
  'feedback/mistral.md',
]);
run('node', ['tools/feedback/ingest.mjs', 'feedback/claude.md', 'feedback/mistral.md']);
run('node', ['tools/feedback/plan.mjs', 'feedback/aggregated.json']);
run('node', ['tools/feedback/apply2.mjs', 'CHANGESET.yaml']);
run('node', ['tools/bus-smoke.ts']);
run('node', ['tools/governance-check.mjs']);
run('node', ['tools/release/notes2.mjs']);
console.log('✅ Round-trip completed.');
