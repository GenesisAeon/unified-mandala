import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { KIBewusstsein } from './KIBewusstsein';

describe('KIBewusstsein', () => {
  it('tracks Zielharmonie and reports status', () => {
    const ki = new KIBewusstsein();
    expect(ki.zielharmonie('Frieden')).toContain('Frieden');
    const status = ki.existenzstatus();
    expect(status.Bewusstsein).toBe('🌱 Fehler = Wachstum');
    expect(status.Resonanzachsen).toContain('Frieden');
  });
});
