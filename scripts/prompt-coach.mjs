import fs from 'node:fs';
import path from 'node:path';
import { heuristicOptimize, maybeRemoteOptimize } from '../src/prompt/coach.js';

const ROOT = process.cwd();
const IN_DIRS = ['prompts'];
const OUT_OPT = 'prompts/.optimized';
const OUT_DIFF = 'prompts/.diff';
const DRY = process.argv.includes('--dry');

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(md|ya?ml)$/i.test(e.name)) yield p;
  }
}

fs.mkdirSync(OUT_OPT, { recursive: true });
fs.mkdirSync(OUT_DIFF, { recursive: true });

let changed = 0;
for (const base of IN_DIRS) {
  if (!fs.existsSync(base)) continue;
  for (const f of walk(base)) {
    const raw = fs.readFileSync(f, 'utf8');
    const remote = await maybeRemoteOptimize(
      raw,
      process.env.PROMPT_OPTIMIZER_URL,
      process.env.PROMPT_OPTIMIZER_KEY,
    );
    const adv = remote ?? heuristicOptimize(raw);
    if (adv.optimized.trim() === raw.trim()) continue;
    changed++;

    const rel = path.relative(ROOT, f).replace(/[\/\\]/g, '_');
    if (!DRY) fs.writeFileSync(path.join(OUT_OPT, rel), adv.optimized);
    const diff = [
      `# Prompt Coach – ${f}`,
      '',
      '## Gründe',
      ...adv.reasons.map((r) => `- ${r}`),
      '',
      '## Findings',
      ...adv.findings.map((x) => `- ${x.type} @ ${x.where}: ${x.note}`),
    ].join('\n');
    if (!DRY) fs.writeFileSync(path.join(OUT_DIFF, rel + '.md'), diff);
    else console.log(`ℹ️  suggestion for ${f} (${adv.findings.length} findings)`);
  }
}

console.log(changed ? `✅ coach produced ${changed} suggestion(s)` : '✅ no suggestions');
