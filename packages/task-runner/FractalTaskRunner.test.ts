import { FractalTaskRunner } from './FractalTaskRunner';
import path from 'path';
import fs from 'fs';

const tmp = path.join(__dirname, 'tmp.yaml');
const plugin = path.join(__dirname, 'sample-plugin.js');

afterEach(() => {
  if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  if (fs.existsSync(plugin)) fs.unlinkSync(plugin);
});

test('runs tasks via plugins', async () => {
  fs.writeFileSync(tmp, '- plugin: "./sample-plugin.js"\n  input: 2');
  fs.writeFileSync(plugin, 'module.exports = (n) => n * 2;');
  const runner = new FractalTaskRunner();
  const [res] = await runner.runFile(tmp);
  expect(res).toBe(4);
});

test('runs tasks via framework runners', async () => {
  fs.writeFileSync(tmp, '- framework: langchain\n  input: "ping"');
  const runner = new FractalTaskRunner();
  const [res] = await runner.runFile(tmp);
  expect(res).toEqual({ framework: 'langchain', input: 'ping' });
});
