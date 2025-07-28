import { describe, it, expect } from 'vitest';
import { integrateShadow, extractShadow } from './ShadowIntegration';

describe('integrateShadow', () => {
  it('encrypts and decrypts using XOR + base64', () => {
    const encoded = integrateShadow('abc', 1);
    expect(encoded).not.toBe('abc');
    expect(extractShadow(encoded, 1)).toBe('abc');
  });
});
