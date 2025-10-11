import fs from 'fs';
import os from 'os';
import cp from 'child_process';
import YAML from 'yaml';

const csPath = process.argv[2] || 'CHANGESET.yaml';
if (!fs.existsSync(csPath)) {
  console.error('Missing', csPath);
  process.exit(1);
}

const doc = YAML.parse(fs.readFileSync(csPath, 'utf-8'));
const diffs = doc?.diffs || [];
const specs = doc?.changespecs || [];

// Map: title -> risk from CHANGESPEC (default: "low")
const riskByTitle = new Map();
for (const c of specs) {
  try {
    const spec = YAML.parse(c.spec);
    for (const ch of spec?.changes || []) {
      if (ch.path || ch.rationale) {
        // fuzzy key based on file path or rationale
        const key = (ch.path || ch.rationale || '').toString();
        const risk = (ch.risk || 'low').toLowerCase();
        riskByTitle.set(key, risk);
      }
    }
  } catch {}
}

function classify(diff) {
  const title = diff.title || '';
  const keys = Array.from(riskByTitle.keys());
  const hit = keys.find((k) => title.includes(k));
  return hit ? riskByTitle.get(hit) : 'low';
}

const buckets = { low: [], medium: [], high: [] };
for (const d of diffs) buckets[classify(d)].push(d);

const order = ['low', 'medium', 'high'];
for (const level of order) {
  for (const d of buckets[level]) {
    const tmp = os.tmpdir() + `/mandala-${Date.now()}-${Math.random().toString(16).slice(2)}.patch`;
    fs.writeFileSync(tmp, d.patch);
    console.log(`\n==> [${level}] DRY-RUN git apply --check: ${d.title || 'untitled'}`);
    try {
      cp.execFileSync('git', ['apply', '--check', tmp], { stdio: 'inherit' });
    } catch {
      console.error('Dry-run failed. Skipping this patch. File left at:', tmp);
      continue;
    }
    console.log(`==> [${level}] APPLY: ${d.title || 'untitled'}`);
    cp.execFileSync('git', ['apply', tmp], { stdio: 'inherit' });
    cp.execFileSync('git', ['add', '-A'], { stdio: 'inherit' });
    cp.execFileSync(
      'git',
      ['commit', '-m', `chore: apply LLM ${level} patch - ${d.title || 'untitled'}`],
      { stdio: 'inherit' },
    );
  }
}
console.log('\n✅ Risk-aware apply finished.');
