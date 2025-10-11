import fs from 'fs';
import cp from 'child_process';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const version = pkg.version || '0.0.0';
const date = new Date().toISOString().split('T')[0];

const log = cp.execSync("git log --pretty=format:'%h;%s' --since='30 days ago'").toString();
const commits = log
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((l) => {
    const [hash, subject] = l.split(';');
    const m = subject.match(/^(\w+)(!:)?(\(.+?\))?:\s*(.*)$/);
    const type = m?.[1] || 'misc';
    const breaking = Boolean(m?.[2]);
    const scope = m?.[3]?.slice(1, -1) || 'core';
    const msg = m?.[4] || subject;
    return { hash, type, scope, msg, breaking };
  });

const groups = {};
for (const c of commits) {
  const key = c.breaking ? 'breaking' : c.type;
  groups[key] = groups[key] || [];
  groups[key].push(c);
}

let out = `# Mandala v${version} (${date})\n\n`;
for (const key of ['feat', 'fix', 'refactor', 'docs', 'test', 'chore', 'breaking', 'misc']) {
  if (!groups[key]?.length) continue;
  out += `## ${key}\n`;
  for (const c of groups[key]) out += `- ${c.msg} (${c.scope}) — ${c.hash}\n`;
  out += '\n';
}
fs.writeFileSync('RELEASE_NOTES.md', out);
console.log('Wrote RELEASE_NOTES.md');
