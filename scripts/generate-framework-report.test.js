import { generate } from './generate-framework-report.js';
import fs from 'fs';
import { describe, it, expect } from 'vitest';

describe('generate-framework-report', () => {
  it('writes report file', () => {
    const out = generate();
    const exists = fs.existsSync('docs/FrameworkReport.md');
    expect(exists).toBe(true);
    expect(out).toMatch(/Framework Report/);
  });
});
