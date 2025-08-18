import fs from 'fs';
import path from 'path';
import { VectorStore } from './VectorStore';

describe('VectorStore', () => {
  const tmpDir = path.join(__dirname, '__test__');
  const file = path.join(tmpDir, 'vectors.json');

  beforeEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('persists vectors and retrieves nearest by cosine similarity', () => {
    const store = new VectorStore(file);
    store.add('a', [1, 0]);
    store.add('b', [0, 1]);

    const results = store.search([0.9, 0.1], 1);
    expect(results[0].id).toBe('a');

    const reloaded = new VectorStore(file);
    const again = reloaded.search([0, 0.8], 1);
    expect(again[0].id).toBe('b');
  });
});
