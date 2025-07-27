import { describe, it, expect } from 'vitest';
import { ResonanceFeedbackModule, FeedbackEntry } from './ResonanceFeedbackModule';

describe('ResonanceFeedbackModule', () => {
  it('calculates user and global resonance', () => {
    const mod = new ResonanceFeedbackModule();
    const entries: FeedbackEntry[] = [
      { userId: 'a', score: 1 },
      { userId: 'a', score: 0 },
      { userId: 'b', score: -1 }
    ];
    entries.forEach(e => mod.addFeedback(e));
    expect(mod.getUserResonance('a')).toBeCloseTo(0.5);
    expect(mod.getUserResonance('b')).toBeCloseTo(-1);
    expect(mod.getGlobalResonance()).toBeCloseTo(0); // (1+0-1)/3
  });
});
