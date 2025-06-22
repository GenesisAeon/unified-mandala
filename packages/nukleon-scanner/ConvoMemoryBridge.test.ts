import { extractConvoMemory } from './ConvoMemoryBridge';

test('extractConvoMemory returns text and signature', () => {
  const res = extractConvoMemory('hello world');
  expect(res.text).toBe('hello world');
  expect(res.crepSignature).toHaveProperty('coherence');
});
