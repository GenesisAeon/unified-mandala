import { readFileSync } from 'fs';
import { join } from 'path';

describe('Framework Bericht', () => {
  const content = readFileSync(join(__dirname, 'Framework-Bericht.md'), 'utf8');

  it('mentioniert Verbesserungen und QuantumTheoryAgent', () => {
    expect(content).toContain('Analyse & Verbesserungen');
    expect(content).toContain('QuantumTheoryAgent Roadmap');
  });
});
