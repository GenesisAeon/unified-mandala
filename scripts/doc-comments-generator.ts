import fs from 'fs';
import path from 'path';
import { extractComments } from './autodoc-comments';

export function generateDocs(files: string[] = [], outDir = 'docs/generated'): string {
  if (!files.length) return 'docs generated';
  fs.mkdirSync(outDir, { recursive: true });
  for (const file of files) {
    const comments = extractComments(file).join('\n\n');
    if (comments) {
      const base = path.basename(file, path.extname(file));
      const outPath = path.join(outDir, `${base}.md`);
      fs.writeFileSync(outPath, comments);
    }
  }
  return 'docs generated';
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error('Usage: ts-node doc-comments-generator.ts <files...>');
    process.exit(1);
  }
  console.log(generateDocs(args));
}
