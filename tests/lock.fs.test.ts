import { describe, it, expect } from 'vitest';
import { FsLock } from '../packages/lock/index';
describe('FsLock', () => {
  it('acquire and release', async () => {
    const l = new FsLock();
    const t = await l.acquire('test-key', 2000);
    await l.release('test-key', t);
    expect(true).toBe(true);
  });
  it('prevents double acquire', async () => {
    const l = new FsLock();
    const t = await l.acquire('same', 1000);
    await expect(l.acquire('same', 1000)).rejects.toThrow();
    await l.release('same', t);
  });
});
