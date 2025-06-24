import fs from 'fs';
import path from 'path';
import { patternReactivator } from './patternReactivator';
import { AeonMemory } from '../core/AeonMemory';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

const CHRONIK = path.resolve('mandala-chronik.yaml');

beforeEach(() => {
  (AeonMemory as any).entries = [];
  if (fs.existsSync(CHRONIK)) fs.unlinkSync(CHRONIK);
});

test('emits reactivate for low crep score', () => {
  const spy = jest.fn();
  GPTEventHub.on('task:reactivate', spy);
  AeonMemory.record('t', { crepScore: 0.2, task: { id: '1', description: 'd' } });
  patternReactivator();
  expect(spy).toHaveBeenCalled();
  GPTEventHub.off('task:reactivate', spy);
});

test('does not emit for high score or missing task', () => {
  const spy = jest.fn();
  GPTEventHub.on('task:reactivate', spy);
  AeonMemory.record('t1', { crepScore: 0.8, task: { id: '2', description: 'x' } });
  AeonMemory.record('t2', { crepScore: 0.1 });
  patternReactivator();
  expect(spy).not.toHaveBeenCalled();
  GPTEventHub.off('task:reactivate', spy);
});
