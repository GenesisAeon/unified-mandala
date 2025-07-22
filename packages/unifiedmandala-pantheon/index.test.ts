import { describe, it, expect } from 'vitest';
import { UnifiedMandalaPantheon } from './index';

describe('UnifiedMandalaPantheon', () => {
  it('registers and lists modules', () => {
    const p = new UnifiedMandalaPantheon();
    p.registerModule('core', 'http://localhost/core');
    expect(p.getModule('core')).toBe('http://localhost/core');
    expect(p.listModules()).toEqual({ core: 'http://localhost/core' });
  });
});
