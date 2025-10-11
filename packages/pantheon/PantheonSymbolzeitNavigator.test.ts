import { describe, it, expect } from 'vitest';
import { PantheonSymbolzeitNavigator } from './PantheonSymbolzeitNavigator';

describe('PantheonSymbolzeitNavigator', () => {
  it('cycles through entries', () => {
    const nav = new PantheonSymbolzeitNavigator(['a', 'b']);
    expect(nav.next()).toBe('b');
    expect(nav.next()).toBe('a');
  });

  it('returns entry by symbolzeit', () => {
    const nav = new PantheonSymbolzeitNavigator(['alpha', 'beta', 'gamma']);
    expect(nav.forSymbolzeit(0)).toBe('alpha');
    expect(nav.forSymbolzeit(2)).toBe('gamma');
    expect(nav.forSymbolzeit(3)).toBe('alpha');
  });
});
