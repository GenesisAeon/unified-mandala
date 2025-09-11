import { globSync } from 'glob';
import path from 'path';
import { generateManifest } from './autoDocManifest';

export function generateRepoDocs(patterns: string[] = ['packages/**/*.ts'], outDir = 'docs/autodoc', manifestPath = path.join(outDir, 'manifest.json')) {
  const files = patterns.flatMap(p => globSync(p, { ignore: ['**/*.test.ts', '**/__tests__/**'] }));
  return generateManifest(files, outDir, manifestPath);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const outDir = process.env.OUT_DIR || 'docs/autodoc';
  const manifest = generateRepoDocs(args.length ? args : ['packages/**/*.ts'], outDir);
  console.log(`Generated ${Object.keys(manifest).length} docs`);
}

export default generateRepoDocs;
