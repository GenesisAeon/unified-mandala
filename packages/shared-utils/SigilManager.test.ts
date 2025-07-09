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

test('emits events on changes', () => {
  const mgr = new SigilManager();
  const added: string[] = [];
  mgr.on('sigil:added', e => added.push(e.id));
  const updated: string[] = [];
  mgr.on('sigil:updated', e => updated.push(e.id));
  const removed: string[] = [];
  mgr.on('sigil:removed', id => removed.push(id));

  mgr.add({ id: 's4', data: {} });
  mgr.update('s4', { x: 1 });
  mgr.remove('s4');

  expect(added).toEqual(['s4']);
  expect(updated).toEqual(['s4']);
  expect(removed).toEqual(['s4']);
});
