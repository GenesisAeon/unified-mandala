import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

describe('adapters_index.json', () => {
  it('contains OISST & ERA5 when available', () => {
    const p = 'out/adapters_index.json';
    if (!fs.existsSync(p)) {
      console.warn('skipping adapters_index smoke – file missing');
      return;
    }
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    expect(Array.isArray(j.adapters)).toBe(true);
    const ids = j.adapters.map((a: any) => String(a.id || a.name || '').toLowerCase());
    expect(ids.some((s: string) => s.includes('oisst'))).toBe(true);
    expect(ids.some((s: string) => s.includes('era5'))).toBe(true);
  });
});
