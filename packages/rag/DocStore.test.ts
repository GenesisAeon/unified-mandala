import fs from 'fs';
import path from 'path';
import { DocStore } from './DocStore';

describe('DocStore', () => {
  const tmpDir = path.join(__dirname, '__test__');
  const file = path.join(tmpDir, 'docs.json');

  beforeEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('stores documents and marks tombstones', () => {
    const store = new DocStore(file);
    store.add({ id: '1', text: 'hello', source: 'test' });

    let doc = store.get('1');
    expect(doc?.text).toBe('hello');
    expect(store.list().length).toBe(1);

    store.tombstone('1');
    expect(store.get('1')).toBeUndefined();
    expect(store.list().length).toBe(0);

    const reloaded = new DocStore(file);
    expect(reloaded.get('1')).toBeUndefined();
  });
});
