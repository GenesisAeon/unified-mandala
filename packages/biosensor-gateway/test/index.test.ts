import { describe, it, expect } from 'vitest';
import { name } from '../src/index';

describe('biosensor-gateway package', () => {
  it('exports name constant', () => {
    expect(name).toBe('biosensor-gateway');
  });
});

