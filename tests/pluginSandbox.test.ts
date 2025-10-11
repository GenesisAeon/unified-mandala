/* @jest-environment node */
import fs from 'fs';
import path from 'path';

describe.skip('Plugin Sandbox', () => {
  const pluginsDir = path.join(__dirname, '..', 'plugins');
  const tmpPluginDir = path.join(pluginsDir, 'sandboxTest');

  beforeAll(() => {
    fs.mkdirSync(tmpPluginDir, { recursive: true });
    fs.writeFileSync(
      path.join(tmpPluginDir, 'manifest.yaml'),
      [
        'name: "sandboxTest"',
        'type: "agent"',
        'description: "sandbox"',
        'version: "1.0.0"',
        'author: "tester"',
        'entry: "index.js"',
        'apiVersion: "1.0"',
        'permissions: []',
      ].join('\n'),
    );
    fs.writeFileSync(
      path.join(tmpPluginDir, 'index.js'),
      "const cp = require('child_process'); module.exports = {}",
    );
  });

  afterAll(() => {
    fs.rmSync(tmpPluginDir, { recursive: true, force: true });
  });

  it('blocks unauthorized imports', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.resetModules();
    process.env.NODE_ENV = 'test';
    const loader = require('../services/plugin-loader');
    const plugin = loader.getPlugin('sandboxTest');
    expect(plugin).toBeUndefined();
    expect(spy).toHaveBeenCalled();
    const err = spy.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toMatch(/not allowed/);
    spy.mockRestore();
  });
});
