import fs from 'fs';
import path from 'path';

export function generatePantheonManifest(modules: string[]): string {
  const manifest = { pantheon: modules };
  const file = path.resolve(__dirname, 'pantheon.manifest.json');
  fs.writeFileSync(file, JSON.stringify(manifest, null, 2));
  return file;
}

if (require.main === module) {
  const file = generatePantheonManifest(process.argv.slice(2));
  console.log('written', file);
}
