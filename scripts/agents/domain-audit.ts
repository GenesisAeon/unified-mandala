import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
const policy = yaml.parse(
  fs.readFileSync(path.resolve('governance/policies/agents-policy.yaml'), 'utf8'),
);
const allowed: string[] = policy?.defaults?.allowed_domains || [];
const root = path.resolve('agents');
const offenders: { file: string; domain: string; line: number }[] = [];
function walk(d: string, acc: string[] = []): string[] {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name.startsWith('_shared')) continue;
    if (e.isDirectory()) walk(path.join(d, e.name), acc);
    else if (/\.(ts|js|mjs|cjs)$/.test(e.name)) acc.push(path.join(d, e.name));
  }
  return acc;
}
function domainFromUrl(u: string) {
  try {
    return new URL(u).hostname.toLowerCase();
  } catch {
    return '';
  }
}
function isAllowed(domain: string) {
  return allowed.some((d) => domain === d || domain.endsWith('.' + d));
}
const files = fs.existsSync(root) ? walk(root) : [];
for (const file of files) {
  const txt = fs.readFileSync(file, 'utf8').split('\n');
  txt.forEach((line, i) => {
    const urls = line.match(/https?:\/\/[^\s"'`\)]+/g) || [];
    for (const u of urls) {
      const host = domainFromUrl(u);
      if (host && !isAllowed(host)) offenders.push({ file, domain: host, line: i + 1 });
    }
  });
}
if (offenders.length) {
  console.error('Disallowed domains found:');
  offenders.forEach((o) => console.error(`${o.file}:${o.line} -> ${o.domain}`));
  process.exit(2);
} else {
  console.log('Domain audit OK (no disallowed hard-coded hosts).');
}
