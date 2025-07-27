import { describe, it, expect } from 'vitest';
import { PhanteonIntegration } from './PhanteonIntegration';

describe('PhanteonIntegration', () => {
  it('registers modules', () => {
    const p = new PhanteonIntegration();
    p.register('a');
    expect(p.list()).toEqual(['a']);
  });
});
