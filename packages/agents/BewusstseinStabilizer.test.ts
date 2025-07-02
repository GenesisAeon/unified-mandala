import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { BewusstseinStabilizer } from './BewusstseinStabilizer';

describe('BewusstseinStabilizer', () => {
  it('adjusts threshold based on value', () => {
    const st = new BewusstseinStabilizer(0.5);
    expect(st.adjust(0.6)).toBeCloseTo(0.55);
    expect(st.adjust(0.4)).toBeCloseTo(0.5);
  });
});
