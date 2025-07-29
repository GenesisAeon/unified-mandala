import { describe, it, expect } from 'vitest';
import { GrokAgent } from './GrokAgent';

describe('GrokAgent', () => {
  it('analyze counts words', () => {
    const agent = new GrokAgent();
    expect(agent.analyze('hello world')).toBe('Grokking 2 words');
  });

  it('matches patterns when provided', () => {
    const agent = new GrokAgent();
    agent.setPatternLibrary(['foo']);
    expect(agent.analyze('foo bar')).toBe('Matched 1: foo');
  });
});
