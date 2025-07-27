import { describe, it, expect } from 'vitest';
import { ResonanceFeedbackModule } from './ResonanceFeedbackModule';

describe('ResonanceFeedbackModule', () => {
  it('computes average', () => {
    const m = new ResonanceFeedbackModule();
    m.record({ userId: 'a', value: 1 });
    m.record({ userId: 'b', value: 3 });
    expect(m.average()).toBe(2);
  });
});
