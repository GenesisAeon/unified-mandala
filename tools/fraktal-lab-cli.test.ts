import path from 'path';
import { execSync } from 'child_process';

test('runs plugins from manifest', () => {
  const cli = path.resolve(__dirname, 'fraktal-lab-cli.ts');
  const manifest = path.resolve(__dirname, '__tests__/fixtures/manifest.yaml');
  const output = execSync(`ts-node ${cli} ${manifest}`).toString();
  expect(output).toMatch('pluginA-run');
  expect(output).toMatch('pluginB-init');
});
