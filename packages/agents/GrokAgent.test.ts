import { describe, it, expect } from 'vitest';
import { GrokAgent } from './GrokAgent';

describe('GrokAgent', () => {
  it('counts words and pattern matches', () => {
    const agent = new GrokAgent();
    agent.addPattern('hello');
    expect(agent.analyze('hello world')).toBe('Grokking 2 words with 1 patterns');
  });
});
