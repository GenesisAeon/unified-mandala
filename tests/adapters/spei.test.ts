import { describe, it, expect } from 'vitest';
import { fetchSPEI } from '../../src/adapters/spei';

describe('adapter spei', () => {
  it('returns empty series (placeholder)', async () => {
    const res = await fetchSPEI();
    expect(res).toEqual([]);
  });
});
