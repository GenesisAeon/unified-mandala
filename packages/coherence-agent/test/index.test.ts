import { describe, it, expect } from 'vitest';
import { name } from '../src/index';

describe('coherence-agent package', () => {
  it('exports name constant', () => {
    expect(name).toBe('coherence-agent');
  });
});

