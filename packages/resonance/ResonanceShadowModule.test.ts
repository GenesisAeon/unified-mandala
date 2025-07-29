import { describe, it, expect } from 'vitest';
import { ResonanceShadowModule } from './ResonanceShadowModule';

describe('ResonanceShadowModule', () => {
  it('integrates values gradually', () => {
    const mod = new ResonanceShadowModule();
    expect(mod.integrate(1)).toBe(0.5);
    expect(mod.integrate(0)).toBe(0.25);
  });
});
