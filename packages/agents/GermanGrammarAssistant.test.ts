import { describe, it, expect } from 'vitest';
import { GermanGrammarAssistant } from './GermanGrammarAssistant';

describe('GermanGrammarAssistant', () => {
  it('detects lowercase sentence starts', () => {
    const gga = new GermanGrammarAssistant();
    const issues = gga.check('das ist ein test. Dies ist korrekt.');
    expect(issues.length).toBe(1);
    expect(issues[0].index).toBe(0);
  });

  it('returns empty array for proper sentences', () => {
    const gga = new GermanGrammarAssistant();
    const issues = gga.check('Das ist gut. Alles Passt.');
    expect(issues.length).toBe(0);
  });
});
