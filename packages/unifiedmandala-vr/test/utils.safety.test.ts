import { describe, it, expect } from 'vitest';
import { sanitizeInput } from '../src/utils/safety';

describe('VR Utils - sanitizeInput', () => {
  it('returns null for unsafe content', () => {
    expect(sanitizeInput('attack something')).toBeNull();
  });
  it('returns original string when safe', () => {
    expect(sanitizeInput('hello')).toBe('hello');
  });
});

