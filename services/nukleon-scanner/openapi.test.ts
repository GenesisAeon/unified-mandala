import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

test('openapi spec defines scan path', () => {
  const file = path.join(__dirname, 'openapi.yaml');
  const spec = YAML.parse(fs.readFileSync(file, 'utf8'));
  expect(spec.paths['/nukleon/scan']).toBeDefined();
});
