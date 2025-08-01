import { getExtendedResonanceBlueprint } from '../ExtendedResonanceBlueprint';

describe('getExtendedResonanceBlueprint', () => {
  it('returns blueprint with ten modules', () => {
    const bp = getExtendedResonanceBlueprint();
    expect(bp.modules.length).toBe(10);
    expect(bp.modules).toContain('EthicGuardian');
  });
});
