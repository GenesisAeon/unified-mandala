/* @jest-environment node */
import { listPlugins, getPlugin } from '../services/plugin-loader';

describe('Plugin Loader', () => {
  it('should list at least one plugin', () => {
    const all = listPlugins();
    expect(all.length).toBeGreaterThan(0);
  });

  it('should load plugin entry point', () => {
    const manifest = listPlugins()[0];
    const plugin = getPlugin(manifest.name);
    expect(plugin).toBeDefined();
    expect(typeof plugin.initialize).toBe('function');
  });
});
