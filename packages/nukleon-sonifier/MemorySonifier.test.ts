import { memoryToTone } from './MemorySonifier';

test('memoryToTone maps weight to tone', () => {
  expect(memoryToTone(0.8)).toBe('high');
  expect(memoryToTone(0.5)).toBe('mid');
  expect(memoryToTone(0.1)).toBe('low');
});
