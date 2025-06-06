import { getCREPState } from './CREPEvaluator';

describe('getCREPState', () => {
  it('returns safe when values high', () => {
    expect(getCREPState({ C: 8, R: 8, E: 8 })).toBe('safe');
  });

  it('returns critical when any value is low', () => {
    expect(getCREPState({ C: 3, R: 5, E: 8 })).toBe('critical');
  });

  it('returns warning for intermediate values', () => {
    expect(getCREPState({ C: 5, R: 5, E: 5 })).toBe('warning');
  });
});
