import { describe, it, expect } from 'vitest';
import { name } from '../src/index';

describe('creative-dreamer package', () => {
  it('exports name constant', () => {
    expect(name).toBe('creative-dreamer');
  });
});

