import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const script = path.join(__dirname, '../export-depth-bundle.ts');
const outDir = path.join(__dirname, '../../tmp-depth');

beforeAll(() => {
  if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true });
});

afterAll(() => {
  if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true });
});

test('export-depth-bundle generates bundle and index', () => {
  execSync(`ts-node ${script} ${outDir}`);
  const bundle = path.join(outDir, 'sigillin_depth_bundle.sigil.json');
  const index = path.join(outDir, 'depth_index.md');
  expect(fs.existsSync(bundle)).toBe(true);
  expect(fs.existsSync(index)).toBe(true);
});
