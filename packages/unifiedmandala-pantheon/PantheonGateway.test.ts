import { describe, it, expect } from 'vitest';
import { PantheonGateway } from './PantheonGateway';

describe('PantheonGateway', () => {
  it('registers and retrieves routes', () => {
    const g = new PantheonGateway();
    g.register('mod', 'http://localhost');
    expect(g.getRoute('mod')).toBe('http://localhost');
    expect(g.list()).toEqual({ mod: 'http://localhost' });
  });
});
