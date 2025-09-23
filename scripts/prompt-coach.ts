import fs from 'node:fs';
import path from 'node:path';
import { heuristicOptimize, maybeRemoteOptimize } from '../src/prompt/coach.js';
import type { PromptAdvice } from '../src/prompt/coach.js';

const ROOT = process.cwd();
const IN_DIRS: readonly string[] = ['prompts'];
const OUT_OPT = 'prompts/.optimized';
const OUT_DIFF = 'prompts/.diff';
const DRY = process.argv.includes('--dry');

function* walk(dir: string): Generator<string> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(filePath);
    } else if (/\.(md|ya?ml)$/i.test(entry.name)) {
      yield filePath;
    }
  }
}

fs.mkdirSync(OUT_OPT, { recursive: true });
fs.mkdirSync(OUT_DIFF, { recursive: true });

let changed = 0;
for (const base of IN_DIRS) {
  if (!fs.existsSync(base)) continue;
  for (const filePath of walk(base)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const remote: PromptAdvice | null = await maybeRemoteOptimize(
      raw,
      process.env.PROMPT_OPTIMIZER_URL,
      process.env.PROMPT_OPTIMIZER_KEY,
    );
    const advice: PromptAdvice = remote ?? heuristicOptimize(raw);
    if (advice.optimized.trim() === raw.trim()) continue;
    changed += 1;

    const relativePath = path.relative(ROOT, filePath).replace(/[\/\\]/g, '_');
    if (!DRY) fs.writeFileSync(path.join(OUT_OPT, relativePath), advice.optimized);
    const diff = [
      `# Prompt Coach – ${filePath}`,
      '',
      '## Gründe',
      ...advice.reasons.map((reason) => `- ${reason}`),
      '',
      '## Findings',
      ...advice.findings.map((finding) => `- ${finding.type} @ ${finding.where}: ${finding.note}`),
    ].join('\n');
    if (!DRY) {
      fs.writeFileSync(path.join(OUT_DIFF, `${relativePath}.md`), diff);
    } else {
      console.log(`ℹ️  suggestion for ${filePath} (${advice.findings.length} findings)`);
    }
  }
}

console.log(changed ? `✅ coach produced ${changed} suggestion(s)` : '✅ no suggestions');
