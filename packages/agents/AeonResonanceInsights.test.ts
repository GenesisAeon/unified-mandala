import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { AeonResonanceInsights } from './AeonResonanceInsights';

describe('AeonResonanceInsights', () => {
  it('computes resonance profiles', () => {
    const ai = new AeonResonanceInsights();
    const logs = ['Resonanz steigt', 'andere Nachricht', 'resonanz ton'];
    const profile = ai.compute(logs);
    expect(profile.count).toBe(2);
    expect(profile.resonanceScore).toBe('Resonanz steigt'.length + 'resonanz ton'.length);
  });
});
