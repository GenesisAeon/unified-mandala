import { SigillinZipSystem } from './SigillinZipSystem';

describe('SigillinZipSystem', () => {
  it('handles transitions and logs', () => {
    const sys = new SigillinZipSystem();
    expect(sys.ladeSigillin('test')).toBe('🧬 Sigillin test geladen.');
    expect(sys.aeonTransition('γ')).toBe('🌀 Aeon-Zustand gewechselt: γ');
    expect(sys.speichereResonanz('Impulse')).toBe('📥 Resonanz archiviert: Impulse');
    const status = sys.systemstatus();
    expect(status.Pfad).toContain('test');
    expect(status['Aktueller Zustand']).toBe('γ');
  });
});
