import { describe, it, expect } from 'vitest';
import * as mod from '../../../src/modules/ki';

describe('modules/ki index exports', () => {
  it('exposes expected symbols', () => {
    expect(typeof mod.BayesDesigner).toBe('function');
    expect(typeof mod.RLCSOAgent).toBe('function');
    expect(typeof mod.evolveGreen).toBe('function');
  });
});
