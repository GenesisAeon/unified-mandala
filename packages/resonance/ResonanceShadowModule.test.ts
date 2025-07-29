import { describe, it, expect } from 'vitest';
import { ResonanceShadowModule } from './ResonanceShadowModule';

describe('ResonanceShadowModule', () => {
  it('enables module', () => {
    const mod = new ResonanceShadowModule();
    mod.enable();
    expect(mod.isEnabled()).toBe(true);
  });
});
