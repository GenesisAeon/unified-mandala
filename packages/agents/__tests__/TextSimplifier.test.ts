import { describe, it, expect } from 'vitest';
import { TextSimplifier } from '../TextSimplifier';

describe('TextSimplifier', () => {
  it('replaces complex words with simpler synonyms', () => {
    const agent = new TextSimplifier();
    agent.handle({ id: 't1', description: 'Commence and utilize before you terminate.' } as any);
    expect(agent.getSimplified()).toBe('start and use before you end.');
  });
});
