import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { describe, it, expect } from 'vitest';

describe('Archiv Menschheitsspuren', () => {
  const archivePath = join(__dirname, 'archiv-menschheitsspuren.md');
  const content = readFileSync(archivePath, 'utf8');

  it('enthält erweiterte Fundliste', () => {
    const entries = [
      'Piri Reis Weltkarte',
      'Boskop-Schädel',
      'Antikythera-Mechanismus',
      'Nazca-Linien',
      'Yonaguni-Monument',
      'Pumapunku',
      'Baalbek Trilithon',
      'Bimini Road',
      'Sphinx, Ägypten',
      'Tinshemet Cave',
      'Qesem Cave',
      'White Sands',
      'Attirampakkam',
      'Gunung Padang',
      'Çatalhöyük',
      'Monte Verde'
    ];
    for (const e of entries) {
      expect(content).toContain(e);
    }
  });

  it('besitzt ein Bildverzeichnis', () => {
    expect(existsSync(join(__dirname, 'images'))).toBe(true);
  });
});
