import { describe, it, expect } from 'vitest';
import { ResonanceFeedbackModule } from './ResonanceFeedbackModule';

describe('ResonanceFeedbackModule', () => {
  it('records and averages feedback', () => {
    const mod = new ResonanceFeedbackModule();
    mod.record(2);
    mod.record(4);
    expect(mod.average()).toBe(3);
  });
});
