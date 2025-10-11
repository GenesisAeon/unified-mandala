import { loadPyramidConfig } from './PyramidConfig';

test('loads valid config', () => {
  const cfg = loadPyramidConfig({
    layers: [{ name: 'base', weight: 1 }],
    totalLayers: 1,
    nodesPerLayer: 1,
    weightFactors: { coherence: 1, resonance: 1, emergence: 1, poetics: 1 },
  });
  expect(cfg.layers[0].name).toBe('base');
  expect(cfg.totalLayers).toBe(1);
  expect(cfg.weightFactors?.coherence).toBe(1);
});

test('throws on invalid config', () => {
  expect(() => loadPyramidConfig({})).toThrow();
});
