import fs from 'fs';
import path from 'path';
const { generateManifest } = require('../autoDocManifest');

test('generateManifest creates docs and manifest', () => {
  const tmp = path.join(__dirname, '__doc');
  const src = path.join(tmp, 'sample.ts');
  fs.mkdirSync(tmp, { recursive: true });
  fs.writeFileSync(src, '/** test comment */\nexport const x = 1;');
  const manifestFile = path.join(tmp, 'manifest.json');
  const result = generateManifest([src], tmp, manifestFile);
  expect(fs.existsSync(path.join(tmp, 'sample.md'))).toBe(true);
  expect(result[src]).toBe(path.join(tmp, 'sample.md'));
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  expect(manifest[src]).toBe(path.join(tmp, 'sample.md'));
  fs.rmSync(tmp, { recursive: true, force: true });
});
