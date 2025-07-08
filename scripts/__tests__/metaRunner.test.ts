import fs from 'fs';
import path from 'path';
const { runMetaTasks } = require('../metaRunner');

test('runMetaTasks executes commands', () => {
  const dir = fs.mkdtempSync(path.join(__dirname, 'meta-'));
  const target = path.join(dir, 'out.txt');
  const config = path.join(dir, 'config.yaml');
  fs.writeFileSync(config, `tasks:\n  - command: echo hello > ${target.replace(/\\/g,'/')}`);
  const count = runMetaTasks(config);
  const content = fs.readFileSync(target, 'utf8').trim();
  expect(count).toBe(1);
  expect(content).toBe('hello');
  fs.rmSync(dir, { recursive: true, force: true });
});
