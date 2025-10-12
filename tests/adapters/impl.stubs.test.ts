import { describe, it, expect } from 'vitest';
import { era5Raw } from '../../src/adapters/impl/era5.stub';
import { oisstRaw } from '../../src/adapters/impl/oisst.stub';

describe('adapters impl stubs', () => {
  it('era5Raw returns ok payload', async () => {
    const res = await era5Raw();
    expect(res.ok).toBe(true);
    expect(res.data).toMatchObject({ location: expect.any(String), values: expect.any(Array) });
  });

  it('oisstRaw returns ok payload', async () => {
    const res = await oisstRaw();
    expect(res.ok).toBe(true);
    expect(res.data).toMatchObject({ region: expect.any(String), sst: expect.any(Array) });
  });
});
