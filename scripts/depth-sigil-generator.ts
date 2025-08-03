import fs from 'fs';
import path from 'path';
import { SigillinGenerator } from '../packages/genesis-sigillin-core/SigillinGenerator';

/**
 * Generates a Sigillin JSON file representing a depth value.
 * @param depth numeric depth value
 * @param outDir directory to write file to (default docs/sigils)
 * @returns path to written file
 */
export function generateDepthSigil(depth: number, outDir = path.join('docs', 'sigils')): string {
  const id = `depth-${depth}`;
  const sig = SigillinGenerator(id, 'crep-trigger', 'draft', 'depth-sigil-generator');
  (sig as any).depth = depth;
  const filePath = path.join(outDir, `${id}.json`);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(sig, null, 2));
  return filePath;
}

if (require.main === module) {
  const depthArg = process.argv[2];
  if (!depthArg) {
    console.error('Usage: depth-sigil-generator <depth> [outDir]');
    process.exit(1);
  }
  const depth = Number(depthArg);
  if (isNaN(depth)) {
    console.error('Depth must be a number');
    process.exit(1);
  }
  const dir = process.argv[3];
  const file = generateDepthSigil(depth, dir);
  console.log(`Generated ${file}`);
}
