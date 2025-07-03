import { loadPyramidConfig } from './PyramidConfig';

test('loads valid config', () => {
  const cfg = loadPyramidConfig({ layers: [{ name: 'base', weight: 1 }] });
  expect(cfg.layers[0].name).toBe('base');
});

test('throws on invalid config', () => {
  expect(() => loadPyramidConfig({})).toThrow();
});
