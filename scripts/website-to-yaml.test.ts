import fs from 'fs';
import { execSync } from 'child_process';

test('website to yaml generates file', () => {
  fs.writeFileSync('test.html', '<h1>Test</h1>');
  execSync('node scripts/website-to-yaml.js test.html');
  const out = fs.readFileSync('codex/website.yaml', 'utf8');
  expect(out).toContain('Test');
  fs.unlinkSync('test.html');
});
