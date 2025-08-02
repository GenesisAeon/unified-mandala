import { readFileSync } from 'fs';
import { join } from 'path';

describe('Ethics Whitepaper', () => {
  const content = readFileSync(join(__dirname, 'ETHICS_WHITEPAPER.md'), 'utf8');

  it('mentions governance mechanisms and trustworthy AI', () => {
    expect(content).toContain('Governance Mechanisms');
    expect(content).toContain('Trustworthy AI Guidelines');
  });
});
