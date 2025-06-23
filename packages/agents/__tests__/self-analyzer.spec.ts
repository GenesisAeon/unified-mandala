import fs from 'fs';
import path from 'path';
import { generateAdvancedTodos } from '../self-analyzer';

describe('self-analyzer agent', () => {
  const tmpYaml = path.join(__dirname, 'tmp-todo.yaml');
  const tmpJson = path.join(__dirname, 'tmp-todo.json');

  afterEach(() => {
    [tmpYaml, tmpJson].forEach(f => fs.existsSync(f) && fs.unlinkSync(f));
  });

  it('writes todo entries', () => {
    const entries = generateAdvancedTodos(tmpYaml, tmpJson);
    expect(fs.existsSync(tmpYaml)).toBe(true);
    expect(fs.existsSync(tmpJson)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
  });
});
