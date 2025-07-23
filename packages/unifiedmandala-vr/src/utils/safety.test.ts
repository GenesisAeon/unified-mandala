const { sanitizeInput } = require('./safety');

describe('sanitizeInput', () => {
  it('returns null for unsafe content', () => {
    expect(sanitizeInput('attack something')).toBeNull();
  });
  it('returns input when safe', () => {
    expect(sanitizeInput('hello')).toBe('hello');
  });
});
