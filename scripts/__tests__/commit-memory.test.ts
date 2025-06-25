import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
const { run } = require('../commit-memory');

test('commit-memory writes meta and patch', async () => {
  const commit = execSync('git rev-parse HEAD').toString().trim();
  const dir = path.join(__dirname, '../../GenesisAeonZIPMEM', commit);
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  await run();
  const meta = path.join(dir, 'meta.yaml');
  const patch = path.join(dir, 'changes.patch');
  const fragmentDir = path.join(dir, 'fragments');
  expect(fs.existsSync(meta)).toBe(true);
  expect(fs.existsSync(patch)).toBe(true);
  expect(fs.existsSync(fragmentDir)).toBe(true);
  const content = fs.readFileSync(meta, 'utf8');
  expect(content).toContain('environment');
  fs.rmSync(dir, { recursive: true, force: true });
});
