import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const exts = new Set(['.ts', '.js', '.py', '.sh']);
const patterns = [
  /pnpm\s+dlx\s+tsx\s+([^\n]+)/g,
  /ts-node\s+([^\n]+)/g,
  /node\s+([^\n]+)/g,
  /python3?\s+([^\n]+)/g,
  /bash\s+([^\n]+)/g,
];

function* walk(dir: string): any {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const out: any[] = [];
for (const f of walk(path.join(ROOT, 'scripts'))) {
  if (!exts.has(path.extname(f))) continue;
  const src = fs.readFileSync(f, 'utf8');
  const hits: string[] = [];
  for (const rx of patterns) {
    let m: RegExpExecArray | null;
    while ((m = rx.exec(src))) hits.push(m[0].trim());
  }
  if (hits.length) out.push({ file: f, commands: hits });
}
fs.writeFileSync('out/command-index.json', JSON.stringify(out, null, 2));
console.log('wrote out/command-index.json');
