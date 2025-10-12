import { describe, it, expect } from 'vitest';
import { name } from '../src/index';

describe('archetype-analyzer package', () => {
  it('exports name constant', () => {
    expect(name).toBe('archetype-analyzer');
  });
});

