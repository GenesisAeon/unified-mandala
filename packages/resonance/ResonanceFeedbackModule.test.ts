import { describe, it, expect } from 'vitest';
import { ResonanceFeedbackModule } from './ResonanceFeedbackModule';

describe('ResonanceFeedbackModule', () => {
  it('calculates average feedback', () => {
    const mod = new ResonanceFeedbackModule();
    mod.addFeedback(2);
    mod.addFeedback(4);
    expect(mod.average()).toBe(3);
  });
});
