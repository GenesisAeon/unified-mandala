import { describe, it, expect } from 'vitest';
import { ResonanceModuleDiagnostics } from '../ResonanceModuleDiagnostics';

describe('ResonanceModuleDiagnostics', () => {
  it('analyzes modules', () => {
    const diag = new ResonanceModuleDiagnostics();
    const res = diag.analyze([{ id: 'm1' }]);
    expect(res).toEqual({ m1: 'ok' });
  });
});
