import { describe, it, expect } from 'vitest';
import { name } from '../src/index';

describe('ethic-guardian package', () => {
  it('exports name constant', () => {
    expect(name).toBe('ethic-guardian');
  });
});

