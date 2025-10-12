import { describe, it, expect } from 'vitest';
import { name } from '../src/index';

describe('crep-plugin-api package', () => {
  it('exports name constant', () => {
    expect(name).toBe('crep-plugin-api');
  });
});

