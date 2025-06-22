import { AeonMemory } from '../core/AeonMemory';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

export function patternReactivator() {
  const top = AeonMemory.top(5);
  top.forEach(e => {
    if ((e.crepScore ?? 1) < 0.3 && e.task) {
      GPTEventHub.emit('task:reactivate', e.task);
    }
  });
}
