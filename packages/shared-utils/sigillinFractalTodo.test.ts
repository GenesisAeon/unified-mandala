import fs from 'fs';
import yaml from 'yaml';
import { updateFractalTodos } from './sigillinFractalTodo';

test('updates todo files from sigillin fractal_path', () => {
  const sig = 'tmp-sigil.yaml';
  fs.writeFileSync(sig, 'fractal_path:\n - A Task\n - Another Task\n');
  const yml = 'tmp-adv.yaml';
  const json = 'tmp-adv.json';
  updateFractalTodos(sig, yml, json);
  const yParsed = yaml.parse(fs.readFileSync(yml, 'utf8')) as any[];
  const jParsed = JSON.parse(fs.readFileSync(json, 'utf8')) as any[];
  fs.unlinkSync(sig);
  fs.unlinkSync(yml);
  fs.unlinkSync(json);
  expect(yParsed[0].task).toBe('A Task');
  expect(jParsed.length).toBe(2);
});
