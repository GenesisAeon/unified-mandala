import { validateCREP } from './CREPValidation';

describe('CREPValidation', () => {
  it('accepts values within 0-10', () => {
    expect(validateCREP({ C: 5, R: 7, E: 3, P: 9 })).toBe(true);
  });

  it('rejects out of range values', () => {
    expect(validateCREP({ C: -1, R: 5, E: 11, P: 4 })).toBe(false);
  });
});
