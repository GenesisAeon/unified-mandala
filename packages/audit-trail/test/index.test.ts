import { describe, it, expect } from 'vitest';
import { name } from '../src/index';

describe('audit-trail package', () => {
  it('exports name constant', () => {
    expect(name).toBe('audit-trail');
  });
});

