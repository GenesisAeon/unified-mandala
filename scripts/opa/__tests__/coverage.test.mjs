import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function run(file, min = '0.8') {
  return execFileSync(
    process.execPath,
    ['scripts/opa/coverage.mjs', '--file', file, '--min', min],
    { encoding: 'utf8' },
  );
}

test('fails on missing coverage.files', () => {
  const d = mkdtempSync(join(tmpdir(), 'opa-'));
  const p = join(d, 'bad.json');
  writeFileSync(p, JSON.stringify({}), 'utf8');
  expect(() => run(p)).toThrow(/coverage\.files missing/);
});

test('passes when above threshold, fails when below', () => {
  const d = mkdtempSync(join(tmpdir(), 'opa-'));
  const p = join(d, 'ok.json');
  writeFileSync(
    p,
    JSON.stringify({
      coverage: { files: { 'policy.rego': { covered: [1, 2], not_covered: [3, 4] } } },
    }),
    'utf8',
  );
  expect(run(p, '0.5')).toMatch(/OPA coverage: 50.00%/);
  expect(() => run(p, '0.75')).toThrow(/below threshold/);
});

test('fails on zero total lines', () => {
  const d = mkdtempSync(join(tmpdir(), 'opa-'));
  const p = join(d, 'zero.json');
  writeFileSync(
    p,
    JSON.stringify({
      coverage: { files: { 'policy.rego': { covered: [], not_covered: [] } } },
    }),
    'utf8',
  );
  expect(() => run(p)).toThrow(/no measurable lines/);
});
