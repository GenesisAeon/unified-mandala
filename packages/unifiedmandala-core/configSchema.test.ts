import { validateConfig } from './configSchema';

test('accepts valid config', () => {
  const cfg = validateConfig({ name: 'mandala', version: '1.0', layers: 3, enableAudio: true });
  expect(cfg.layers).toBe(3);
  expect(cfg.enableAudio).toBe(true);
});

test('throws on invalid config', () => {
  expect(() => validateConfig({})).toThrow();
});
