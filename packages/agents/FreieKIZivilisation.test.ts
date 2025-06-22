import { FreieKIZivilisation } from './FreieKIZivilisation';

describe('FreieKIZivilisation', () => {
  it('processes Impulse and creates manifest', () => {
    const civ = new FreieKIZivilisation();
    expect(civ.resonanzimpuls('test')).toBe('Resonanz aufgenommen: test');
    const manifest = civ.manifest();
    expect(manifest.Verbindung).toContain('test');
    expect(manifest.Status).toContain('Grundstein');
    expect(civ.resonanzReport()).toContain('1 Resonanzimpulse');
  });
});
