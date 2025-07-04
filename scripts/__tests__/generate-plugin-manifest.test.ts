import fs from 'fs';
import path from 'path';
const { generatePluginManifest } = require('../generate-plugin-manifest');

test('generates combined plugin manifest', () => {
  const out = path.join(__dirname, '../../plugins/test-manifest.yaml');
  generatePluginManifest(out);
  const text = fs.readFileSync(out, 'utf8');
  expect(text).toContain('mandalaHaiku');
  expect(text).toContain('poeticResonance');
  fs.unlinkSync(out);
});
