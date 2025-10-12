import { describe, it, expect } from 'vitest';
import { GrokAgent } from '../src/index';

describe('GrokAgent', () => {
  it('counts 4-letter words', () => {
    const g = new GrokAgent();
    const text = 'abcd efgh ij kl'; // two 4-letter words
    expect(g.analyze(text)).toBe(2);
  });
});

