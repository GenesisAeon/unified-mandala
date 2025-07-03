import { MemoryMeshSystem } from './MemoryMeshSystem';

test('stores entries per module', () => {
  const m = new MemoryMeshSystem();
  m.add('alpha', { id: '1', data: 'a', timestamp: 0 });
  m.add('beta', { id: '2', data: 'b', timestamp: 1 });
  expect(m.query('alpha')[0].data).toBe('a');
  expect(m.modules().sort()).toEqual(['alpha', 'beta']);
});
