import { loadTheoryAgentConfig } from './TheoryAgentConfig';
import { describe, expect, test } from 'vitest';

describe('loadTheoryAgentConfig', () => {
  test('loads valid config', () => {
    const cfg = loadTheoryAgentConfig({
      name: 'agent',
      version: '1.0',
      description: 'test',
      weights: { theory: 1, practice: 2 },
    });
    expect(cfg.name).toBe('agent');
    expect(cfg.weights.theory).toBe(1);
  });

  test('throws on invalid config', () => {
    expect(() => loadTheoryAgentConfig({})).toThrow();
  });
});
