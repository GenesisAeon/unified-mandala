import { test, expect, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { runFractalTask } from './TaskRunner';

const tmpYaml = path.join(__dirname, 'task.yaml');
const pluginJs = path.join(__dirname, 'plugin.js');
const historyFile = path.resolve('sigillin_history.yaml');

afterEach(() => {
  if (fs.existsSync(tmpYaml)) fs.unlinkSync(tmpYaml);
  if (fs.existsSync(pluginJs)) fs.unlinkSync(pluginJs);
  if (fs.existsSync(historyFile)) fs.unlinkSync(historyFile);
});

test('writes sigillin history after run', async () => {
  fs.writeFileSync(
    pluginJs,
    'module.exports = class { constructor(){} analyze(){ return {foo:1}; }}',
  );
  fs.writeFileSync(
    tmpYaml,
    'sigillin_id: test\ninput: []\nsteps:\n - plugin: "' +
      pluginJs.replace(/\\/g, '/') +
      '"\n   config: {}\ndoc: true',
  );
  await runFractalTask(tmpYaml);
  expect(fs.existsSync(historyFile)).toBe(true);
  const content = fs.readFileSync(historyFile, 'utf8');
  expect(content).toContain('sigillin_id: test');
});
