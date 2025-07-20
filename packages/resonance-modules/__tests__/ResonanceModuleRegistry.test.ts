import { describe, it, expect } from 'vitest';
import { ResonanceModuleRegistry, RegisteredModule } from '../ResonanceModuleRegistry';

describe('ResonanceModuleRegistry', () => {
  it('registers and runs modules', () => {
    const reg = new ResonanceModuleRegistry();
    const mod: RegisteredModule = { id: 'a', process: (x) => `proc:${x}` };
    reg.register(mod);
    expect(reg.get('a')).toBe(mod);
    expect(reg.run('a', 1)).toBe('proc:1');
  });
});
