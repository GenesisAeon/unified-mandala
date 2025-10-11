import fs from 'fs';
import path from 'path';
import { ResonanzPoetik, PoeticResult } from './resonanzPoetik';

const task = { id: 't1', description: 'Ein einfacher Testtask fuer Haikus' } as any;

test('generateHaiku creates 3-line poem', () => {
  const haiku = ResonanzPoetik.generateHaiku(task, 'Alpha', 0.75);
  const lines = haiku.split('\n');
  expect(lines).toHaveLength(3);
  expect(lines[1]).toContain('Alpha');
});

test('compileYAML writes yaml file', () => {
  const poem = ResonanzPoetik.generateHaiku(task, 'Beta', 0.5);
  const results: PoeticResult[] = [
    { timestamp: '2024-01-01', taskId: 't1', phase: 'Beta', crepScore: 0.5, vers: poem },
  ];
  const filename = 'test_poem.yaml';
  ResonanzPoetik.compileYAML(results, filename);
  const content = fs.readFileSync(path.join(process.cwd(), filename), 'utf-8');
  expect(content).toContain('timestamp: 2024-01-01');
  fs.unlinkSync(path.join(process.cwd(), filename));
});
