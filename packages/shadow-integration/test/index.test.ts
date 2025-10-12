import { describe, it, expect } from 'vitest';
import { name, init } from '../src/index';

describe('shadow-integration package', () => {
  it('exports name and init', () => {
    expect(name).toBe('shadow-integration');
    expect(init()).toBe('shadow-integration ready');
  });
});

