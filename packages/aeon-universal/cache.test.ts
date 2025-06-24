import { compile } from './compiler';
import { compileCache } from './cache';

describe('compile cache', () => {
  it('reuses cached result for identical source', () => {
    compileCache.clear();
    const res1 = compile('TASK X');
    const res2 = compile('TASK X');
    expect(res1).toBe(res2);
  });
});
