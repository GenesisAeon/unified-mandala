import fs from 'fs';
import path from 'path';

export function extractComments(file: string): string[] {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /\/\*\*([\s\S]*?)\*\//g;
  const blocks: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content))) {
    const cleaned = match[1]
      .split('\n')
      .map((l) => l.replace(/^\s*\* ?/, ''))
      .join('\n')
      .trim();
    if (cleaned) blocks.push(cleaned);
  }
  return blocks;
}

export function generateDocs(files: string[], outDir: string): Record<string, string> {
  const mapping: Record<string, string> = {};
  fs.mkdirSync(outDir, { recursive: true });
  for (const f of files) {
    const docs = extractComments(f).join('\n\n');
    if (!docs) continue;
    const base = path.basename(f, path.extname(f));
    const out = path.join(outDir, `${base}.md`);
    fs.writeFileSync(out, docs);
    mapping[f] = out;
  }
  return mapping;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error('Usage: ts-node autodoc-comments.ts <file...>');
    process.exit(1);
  }
  const outDir = path.join('docs', 'autodoc-comments');
  const map = generateDocs(args, outDir);
  console.log('Generated', Object.values(map).length, 'docs');
}
