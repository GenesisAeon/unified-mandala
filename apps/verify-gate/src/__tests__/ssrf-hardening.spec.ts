import { describe, expect, it } from 'vitest';
import { isPrivateOrBlocked } from '../security/ipRanges.js';
import { resolveHostStrictTTL, SSRFPrivateTargetError } from '../security/resolve.js';

describe('ip classification', () => {
  it.each([
    ['::1', true],
    ['fc00::1', true],
    ['127.0.0.1', true],
    ['64:ff9b::7f00:1', true],
    ['1.1.1.1', false],
  ])('flags %s as private=%s', (ip, expected) => {
    expect(isPrivateOrBlocked(ip)).toBe(expected);
  });
});

describe('resolveHostStrictTTL', () => {
  it('throws for loopback literals', async () => {
    await expect(resolveHostStrictTTL('127.0.0.1')).rejects.toBeInstanceOf(SSRFPrivateTargetError);
  });
});
