import { describe, it, expect } from 'vitest';
import { ResonanceFeedbackModule } from './ResonanceFeedbackModule';

describe('ResonanceFeedbackModule', () => {
  it('calculates average rating', () => {
    const mod = new ResonanceFeedbackModule();
    mod.addFeedback({ rating: 4 });
    mod.addFeedback({ rating: 2 });
    expect(mod.getAverageRating()).toBe(3);
    mod.clear();
    expect(mod.getAverageRating()).toBe(0);
  });
});
