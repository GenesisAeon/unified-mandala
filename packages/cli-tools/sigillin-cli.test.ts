import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

describe('sigillin-cli bump-version', () => {
  const tmp = path.join(__dirname, 'tmp.sigil.json');
  beforeEach(() => {
    fs.writeFileSync(tmp, JSON.stringify({ id: 'tmp', version: 1 }));
  });
  afterEach(() => {
    fs.unlinkSync(tmp);
  });
  it('increments version field', () => {
    const cli = path.join(__dirname, 'sigillin-cli.js');
    const result = spawnSync('node', [cli, 'bump-version', tmp]);
    expect(result.status).toBe(0);
    const updated = JSON.parse(fs.readFileSync(tmp, 'utf8'));
    expect(updated.version).toBe(2);
  });
});
