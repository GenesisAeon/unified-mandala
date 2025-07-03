import fs from 'fs';
import { createDefaultPyramidConfig } from './PyramidInit';

test('creates config file', () => {
  const file = 'test.pyramid.json';
  createDefaultPyramidConfig(file);
  const content = fs.readFileSync(file, 'utf-8');
  const cfg = JSON.parse(content);
  expect(cfg.layers.length).toBe(3);
  fs.unlinkSync(file);
});
