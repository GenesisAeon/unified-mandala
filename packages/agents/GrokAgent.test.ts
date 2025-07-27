import { describe, it, expect } from 'vitest';
import { GrokAgent } from './GrokAgent';

describe('GrokAgent', () => {
  it('analyze counts words', () => {
    const agent = new GrokAgent();
    expect(agent.analyze('hello world')).toBe('Grokking 2 words');
  });
});
