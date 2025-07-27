import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import { execSync } from 'child_process';

const outDir = 'docs/sigils/manifest_test';

describe('manifest export', () => {
  beforeAll(() => {
    execSync(`ts-node scripts/export-sigil-manifest.ts ${outDir}`);
  });

  it('creates manifest files', () => {
    expect(fs.existsSync(`${outDir}/sigil_manifest.json`)).toBe(true);
    expect(fs.existsSync(`${outDir}/sigil_manifest.yaml`)).toBe(true);
    expect(fs.existsSync(`${outDir}/README.md`)).toBe(true);
  });

  afterAll(() => {
    fs.rmSync(outDir, { recursive: true, force: true });
  });
});
