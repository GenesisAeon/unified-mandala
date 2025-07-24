import { describe, it, expect } from 'vitest';
import { ResonanceFeedbackModule } from '../ResonanceFeedbackModule';

describe('ResonanceFeedbackModule', () => {
  it('records and averages feedback', () => {
    const mod = new ResonanceFeedbackModule();
    mod.record(1);
    mod.record(2);
    expect(mod.average()).toBe(1.5);
  });
});
