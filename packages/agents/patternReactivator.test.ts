import { patternReactivator } from './patternReactivator';
import { AeonMemory } from '../core/AeonMemory';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

test('emits reactivate for low crep score', () => {
  const spy = jest.fn();
  GPTEventHub.on('task:reactivate', spy);
  AeonMemory.record('t', { crepScore: 0.2, task: { id: '1', description: 'd' } });
  patternReactivator();
  expect(spy).toHaveBeenCalled();
  GPTEventHub.off('task:reactivate', spy);
});
