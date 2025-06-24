import fs from 'fs';
import path from 'path';
import { compile } from './compiler';

const CHRONIK = path.resolve('mandala-chronik.yaml');

describe('AeonUniversal compile', () => {
  beforeEach(() => {
    if (fs.existsSync(CHRONIK)) fs.unlinkSync(CHRONIK);
  });

  it('creates tasks and records memory', () => {
    const result = compile('TASK Demo\nREM Erinnerung');
    expect(result.tasks[0].description).toBe('Demo');
    const content = fs.readFileSync(CHRONIK, 'utf-8');
    expect(content).toContain('Erinnerung');
  });
});
