import { describe, it, expect } from 'vitest';
import { PantheonHologramProjector } from './PantheonHologramProjector';

describe('PantheonHologramProjector', () => {
  it('projects hologram messages', () => {
    const p = new PantheonHologramProjector();
    expect(p.project('hello')).toBe('hologram:hello');
  });
});
