import { formatForDyslexia } from './LegasthenieHelper';

describe('formatForDyslexia', () => {
  it('wraps text with dyslexia friendly styles', () => {
    const out = formatForDyslexia('Hallo Welt');
    expect(out).toContain('OpenDyslexic');
    expect(out).toContain('Hallo Welt');
    expect(out.startsWith('<span')).toBe(true);
  });

  it('inserts syllable separators', () => {
    const out = formatForDyslexia('Hallo', { syllableSeparator: '-' });
    expect(out).toContain('Hal-lo');
  });
});
