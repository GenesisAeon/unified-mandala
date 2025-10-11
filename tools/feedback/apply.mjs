import fs from 'fs';
import cp from 'child_process';
import os from 'os';
const csPath = process.argv[2] || 'CHANGESET.yaml';
if (!fs.existsSync(csPath)) {
  console.error('missing', csPath);
  process.exit(1);
}
const raw = fs.readFileSync(csPath, 'utf-8');
// naive YAML parse just for blocks
function parseBlocks(y) {
  const blocks = [];
  const re = /patch:\s*\|\n([\s\S]*?)(?=\n\s*[a-z]+\:|\nchangespecs\:|\n- from\:|$)/gim;
  let m;
  while ((m = re.exec(y))) blocks.push(m[1].replace(/\n {6}/g, '\n').replace(/^ {6}/, ''));
  return blocks;
}
const patches = parseBlocks(raw);
if (!patches.length) {
  console.log('No patches found in', csPath);
  process.exit(0);
}
for (let i = 0; i < patches.length; i++) {
  const p = patches[i];
  const tmp = os.tmpdir() + `/mandala-patch-${Date.now()}-${i}.patch`;
  fs.writeFileSync(tmp, p);
  console.log('Applying', tmp);
  try {
    cp.execFileSync('git', ['apply', tmp], { stdio: 'inherit' });
    cp.execFileSync('git', ['add', '-A'], { stdio: 'inherit' });
    cp.execFileSync('git', ['commit', '-m', `chore: apply LLM patch ${i + 1}`], {
      stdio: 'inherit',
    });
  } catch (e) {
    console.error('Patch failed; leaving tmp:', tmp);
    process.exit(1);
  }
}
console.log('All patches applied & committed.');
