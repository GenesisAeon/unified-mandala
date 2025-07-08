import { BaseNode } from './composite';

test('adds child node', () => {
  const root = new BaseNode('root');
  const child = new BaseNode('child');
  root.add(child);
  expect(root.children[0]).toBe(child);
});
