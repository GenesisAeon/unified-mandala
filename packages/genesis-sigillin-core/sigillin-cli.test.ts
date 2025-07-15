import { execSync } from 'child_process';
import { existsSync, readFileSync, unlinkSync } from 'fs';
import { validateSigillin } from './sigillin-validator';

test('sigillin-cli create and bump-version', () => {
  const file = 'test-sigil.json';
  execSync(`node packages/genesis-sigillin-core/sigillin-cli.js create ${file} testid poetic-root draft Tester`);
  expect(existsSync(file)).toBe(true);
  expect(validateSigillin(file)).toBe(true);
  execSync(`node packages/genesis-sigillin-core/sigillin-cli.js bump-version ${file}`);
  const data = JSON.parse(readFileSync(file, 'utf8'));
  expect(data.schema_version).toMatch(/^1\.0\.\d+$/);
  unlinkSync(file);
});
