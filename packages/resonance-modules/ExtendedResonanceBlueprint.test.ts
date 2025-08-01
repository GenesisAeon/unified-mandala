import { ExtendedResonanceBlueprint } from './ExtendedResonanceBlueprint';

describe('ExtendedResonanceBlueprint', () => {
  it('contains services with endpoints', () => {
    expect(ExtendedResonanceBlueprint.length).toBeGreaterThan(0);
    for (const svc of ExtendedResonanceBlueprint) {
      expect(svc.endpoint).toMatch(/^\//);
      expect(typeof svc.name).toBe('string');
    }
  });
});
