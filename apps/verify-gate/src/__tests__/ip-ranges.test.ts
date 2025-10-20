import { describe, expect, it } from 'vitest';
import { isPrivateOrBlocked, normalizeIp } from '../security/ipRanges.js';

describe('ipRanges', () => {
  describe('normalizeIp', () => {
    it('strips zone identifiers before normalizing IPv6 addresses', () => {
      expect(normalizeIp('fe80::1%eth0')).toBe('fe80:0:0:0:0:0:0:1');
    });

    it('compresses expanded IPv6 addresses', () => {
      expect(normalizeIp('2001:0db8:0000:0000:0000:0000:0000:0001')).toBe('2001:db8:0:0:0:0:0:1');
    });
  });

  describe('isPrivateOrBlocked', () => {
    it('flags NAT64 well-known prefixes', () => {
      expect(isPrivateOrBlocked('64:ff9b:1::c000:201')).toBe(true);
    });

    it('flags Teredo benchmark ranges', () => {
      expect(isPrivateOrBlocked('2001:2::1234')).toBe(true);
    });
  });
});
