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

export function generateManifest(files: string[], outDir: string, manifestPath: string) {
  const manifest: Record<string, string> = {};
  fs.mkdirSync(outDir, { recursive: true });
  for (const file of files) {
    const docs = extractComments(file).join('\n\n');
    if (!docs) continue;
    const base = path.basename(file, path.extname(file));
    const outFile = path.join(outDir, `${base}.md`);
    fs.writeFileSync(outFile, docs);
    manifest[file] = outFile;
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  return manifest;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error('Usage: ts-node autoDocManifest.ts <files...>');
    process.exit(1);
  }
  const outDir = path.join('docs', 'autodoc-manifest');
  const manifestFile = path.join(outDir, 'manifest.json');
  generateManifest(args, outDir, manifestFile);
  console.log(`Generated manifest at ${manifestFile}`);
}
