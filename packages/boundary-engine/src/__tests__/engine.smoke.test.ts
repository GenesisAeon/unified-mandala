import { describe, it, expect } from 'vitest';
import DiscoveryEngine from '../engine';

describe('boundary-engine smoke', () => {
  it('detects violations via regex patterns', async () => {
    const eng = new DiscoveryEngine();
    eng.loadRules([
      { id: 'no-todo', description: 'No TODO in code', severity: 'warn', pattern: '\\bTODO\\b' },
      { id: 'no-secret', description: 'No fake secret', severity: 'error', pattern: 'API_KEY=.*' },
    ]);
    const res = await eng.run([{ source: 'x.ts', content: 'const a=1; // TODO fix' }]);
    expect(res.rulesCount).toBe(2);
    expect(res.observationsCount).toBe(2);
    expect(res.violationsCount).toBe(1);
    expect(res.summary.warn).toBe(1);
  });
});

