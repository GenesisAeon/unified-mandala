import { SigilManager } from './SigilManager';

test('adds and removes sigils', () => {
  const mgr = new SigilManager();
  mgr.add({ id: 's1', data: { a: 1 } });
  expect(mgr.list()).toHaveLength(1);
  mgr.update('s1', { a: 2 });
  expect(mgr.list()[0].data).toEqual({ a: 2 });
  mgr.remove('s1');
  expect(mgr.list()).toHaveLength(0);
});

test('parses YAML or JSON strings', () => {
  const mgr = new SigilManager();
  mgr.loadFromString('s2', '{"x":1}');
  mgr.loadFromString('s3', 'y: 2');
  expect(mgr.list().map(s => s.id)).toEqual(['s2', 's3']);
});
