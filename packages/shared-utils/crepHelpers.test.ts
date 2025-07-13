import { getCREPPhaseColor, getCREPFrequency, getCREPTuning } from './crepHelpers';

describe('getCREPPhaseColor', () => {
  it('returns red for critical values', () => {
    expect(getCREPPhaseColor({ C: 1, R: 3, E: 2 })).toBe('red');
  });
  it('returns green for safe values', () => {
    expect(getCREPPhaseColor({ C: 8, R: 8, E: 9 })).toBe('green');
  });
  it('returns orange otherwise', () => {
    expect(getCREPPhaseColor({ C: 5, R: 5, E: 5 })).toBe('orange');
  });
});

describe('crep tuning helpers', () => {
  test('getCREPFrequency returns expected value', () => {
    expect(getCREPFrequency({ P: 5 })).toBe(270);
  });

  test('getCREPTuning returns color and frequency', () => {
    const result = getCREPTuning({ C: 8, R: 8, E: 8, P: 5 });
    expect(result).toEqual({ color: 'green', frequency: 270 });
  });
});
