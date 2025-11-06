import fs from 'fs';
import yaml from 'yaml';

test('loads symbolzeit config', () => {
  const doc = yaml.parse(fs.readFileSync('config/symbolzeit.yaml', 'utf8'));
  expect(Array.isArray(doc.phasen)).toBe(true);
});
