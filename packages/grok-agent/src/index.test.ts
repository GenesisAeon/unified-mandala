import { describe, it, expect } from 'vitest';
import { GrokAgent } from './index';

describe('GrokAgent', () => {
  it('analyze counts four-letter words', () => {
    const agent = new GrokAgent();
    expect(agent.analyze('this test uses four word size')).toBe(6);
  });
});
