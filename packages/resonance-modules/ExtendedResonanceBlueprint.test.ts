import { describe, it, expect } from 'vitest';
import { createExtendedResonanceBlueprint } from './ExtendedResonanceBlueprint';

describe('createExtendedResonanceBlueprint', () => {
  it('generates endpoints for names', () => {
    const bp = createExtendedResonanceBlueprint(['Alpha']);
    expect(bp).toEqual([{ name: 'Alpha', endpoint: '/resonance/alpha' }]);
  });
});
