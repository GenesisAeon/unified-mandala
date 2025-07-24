import { describe, it, expect } from 'vitest';
import { PantheonSymbolzeitNavigator } from './PantheonSymbolzeitNavigator';

describe('PantheonSymbolzeitNavigator', () => {
  it('cycles through entries', () => {
    const nav = new PantheonSymbolzeitNavigator(['a','b']);
    expect(nav.next()).toBe('b');
    expect(nav.next()).toBe('a');
  });
});
