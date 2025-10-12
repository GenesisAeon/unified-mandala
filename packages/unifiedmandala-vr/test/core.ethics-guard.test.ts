import { describe, it, expect } from 'vitest';
import { EthicsGuard } from '../src/core/EthicsGuard';

describe('VR Core - EthicsGuard', () => {
  it('blocks banned words (case-insensitive)', () => {
    const g = new EthicsGuard();
    expect(g.isSafe('Attack now')).toBe(false);
    expect(g.isSafe('inject payload')).toBe(false);
  });

  it('allows safe content', () => {
    const g = new EthicsGuard();
    expect(g.isSafe('hello world')).toBe(true);
  });
});

