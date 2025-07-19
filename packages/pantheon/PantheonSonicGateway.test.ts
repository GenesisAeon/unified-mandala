import { describe, it, expect } from 'vitest';
import { PantheonSonicGateway } from './PantheonSonicGateway';

describe('PantheonSonicGateway', () => {
  it('prefixes sonic', () => {
    const gw = new PantheonSonicGateway();
    expect(gw.send('ping')).toBe('sonic:ping');
  });
});
