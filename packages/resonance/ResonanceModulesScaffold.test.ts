import { describe, it, expect } from 'vitest';
import { ResonanceModulesScaffold } from './ResonanceModulesScaffold';

describe('ResonanceModulesScaffold', () => {
  it('registers modules', () => {
    const scaffold = new ResonanceModulesScaffold();
    scaffold.register({ id: 'mod1', activate() {} });
    expect(scaffold.getModules()).toHaveLength(1);
  });
});
