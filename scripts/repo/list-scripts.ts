import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
function* walk(dir: string): any {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const exts = new Set(['.ts', '.js', '.py', '.sh', '.mjs', '.cjs']);
const files: string[] = [];
for (const f of walk(path.join(ROOT, 'scripts'))) {
  if (exts.has(path.extname(f))) files.push(f);
}
console.log(JSON.stringify(files.sort(), null, 2));
