import { MemoryMesh } from './index';

test('process integrates services', () => {
  const mesh = new MemoryMesh();
  const result = mesh.process('EU', 'hello');
  expect(result.reflection).toBe('Echo: olleh');
  expect(result.metrics).toEqual({ frequency: 1, depth: 5 });
  expect(mesh.history('EU')).toEqual(['hello']);
  expect(mesh.getHabits()).toEqual({ message: 1 });
});
