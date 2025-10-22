import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const parserPath = path.resolve(repoRoot, 'scripts', 'opa', 'coverage.mjs');

function runCoverageParser(report: unknown, args: string[] = []) {
  return spawnSync(process.execPath, [parserPath, '--min', '0.5', '--top', '1', ...args], {
    input: JSON.stringify(report),
    encoding: 'utf8',
  });
}

describe('scripts/opa/coverage.mjs', () => {
  it('fails when OPA reports failing tests', () => {
    const report = {
      failures: [
        {
          message: 'boom',
          location: { file: 'policy.rego', row: 42 },
        },
      ],
      coverage: {
        files: {
          'policy.rego': { covered: [1, 2], not_covered: [] },
        },
      },
    };

    const result = runCoverageParser(report);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/OPA tests failed/i);
  });

  it('fails closed when coverage files block missing', () => {
    const result = runCoverageParser({ failures: [] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/COVERAGE_FILES_MISSING|COVERAGE_MISSING/);
  });

  it('succeeds for passing tests above threshold', () => {
    const report = {
      failures: [],
      coverage: {
        files: {
          'policy.rego': { covered: [1, 2, 3], not_covered: [4] },
        },
      },
    };

    const result = runCoverageParser(report);
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/OPA coverage:/);
  });
});
