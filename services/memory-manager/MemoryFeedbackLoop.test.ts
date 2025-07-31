import { MemoryManager } from './index';
import { ingestArchives } from './MemoryFeedbackLoop';

test('ingests archive lines into longterm memory', () => {
  const mm = new MemoryManager({ daily: 10, weekly: 20, longterm: 30 });
  ingestArchives(mm);
  expect(mm.get('longterm').length).toBeGreaterThan(0);
  mm.stop();
});
