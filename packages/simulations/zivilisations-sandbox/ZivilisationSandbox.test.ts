import { describe, it, expect } from 'vitest';
import { createSandbox } from './index';

describe('createSandbox', () => {
  it('creates an empty sandbox', () => {
    const sb = createSandbox('test');
    expect(sb.name).toBe('test');
    expect(sb.structures).toEqual([]);
  });
});
