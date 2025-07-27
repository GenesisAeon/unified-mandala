import { describe, it, expect } from 'vitest';
import { ResonanceFeedbackModule } from './ResonanceFeedbackModule';

describe('ResonanceFeedbackModule wrapper', () => {
  it('records feedback', () => {
    const mod = new ResonanceFeedbackModule();
    mod.record(2);
    expect(mod.average()).toBe(2);
  });
});
