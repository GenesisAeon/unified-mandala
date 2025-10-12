import { describe, it, expect } from 'vitest';
import { name } from '../src/index';

describe('synchronizer package', () => {
  it('exports name constant', () => {
    expect(name).toBe('synchronizer');
  });
});

