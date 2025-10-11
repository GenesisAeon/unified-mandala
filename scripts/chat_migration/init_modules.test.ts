import { describe, it, expect } from 'vitest';
import { initModules } from './init_modules';

describe('initModules', () => {
  it('reports module existence', async () => {
    const modules = await initModules();
    const names = modules.map((m) => m.name);
    expect(names).toContain('Ethical Refusal');
    expect(names).toContain('Singularity Simulator');
    expect(names).toContain('Weltinnenpolitik-Simulator');

    const singularity = modules.find((m) => m.name === 'Singularity Simulator');
    expect(singularity?.exists).toBe(true);
  });
});
