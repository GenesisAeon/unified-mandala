import { describe, it, expect } from 'vitest';
import { name } from '../src/index';

describe('meme-chronicle package', () => {
  it('exports name constant', () => {
    expect(name).toBe('meme-chronicle');
  });
});

