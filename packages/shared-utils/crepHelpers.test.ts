import { getCREPPhaseColor } from './crepHelpers';

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
