import { describe, it, expect } from 'vitest';
import { AeonResonanceModules } from './AeonResonanceModules';

describe('AeonResonanceModules', () => {
  it('registers modules', () => {
    const mods = new AeonResonanceModules();
    mods.register({ id: 'm', run: () => 'ok' });
    expect(mods.modules).toHaveLength(1);
  });
});
