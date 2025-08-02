import { readFileSync } from 'fs';
import { join } from 'path';

describe('Erweitertes Archiv Menschheitsspuren', () => {
  const archivePath = join(__dirname, 'archiv-menschheitsspuren.md');
  const content = readFileSync(archivePath, 'utf8');

  it('enthält zusätzliche Fundorte', () => {
    const entries = ['Çatalhöyük', 'Laetoli', 'Olduvai-Schlucht'];
    for (const e of entries) {
      expect(content).toContain(e);
    }
  });
});
