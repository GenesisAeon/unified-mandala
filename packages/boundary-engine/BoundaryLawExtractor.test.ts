import { describe, it, expect } from 'vitest';
import fs from 'fs';
import { BoundaryLawExtractor } from './BoundaryLawExtractor';

describe('BoundaryLawExtractor', () => {
  it('parses boundary_rule blocks', () => {
    const file = 'tmp_rule.md';
    fs.writeFileSync(
      file,
      '\n```yaml\nboundary_rule:\n  name: TestRule\n  domain: test\n```\n'
    );
    const ext = new BoundaryLawExtractor([file]);
    const rules = ext.extract();
    expect(rules[0].name).toBe('TestRule');
    fs.unlinkSync(file);
  });
});
