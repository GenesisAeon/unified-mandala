import { describe, it, expect, vi, test } from 'vitest';
import axios from 'axios';
import { fetchCosmicData, analyzeCosmicData, callPySRService } from '../CosmicTheoryAgent';

vi.mock('axios');

describe('fetchCosmicData', () => {
  it('throws on network error', async () => {
    (axios.get as any).mockRejectedValueOnce(new Error('Network Error'));
    await expect(fetchCosmicData('http://example.com')).rejects.toThrow('Network Error');
  });
});

test('analyzes cosmic values', () => {
  const result = analyzeCosmicData([4]);
  expect(result).toBe('y = 2.0');
});

describe('callPySRService', () => {
  it('caches results for identical inputs', async () => {
    (axios.post as any).mockResolvedValueOnce({ data: { equation: 'x' } });
    const eq1 = await callPySRService([1], 'http://pysr');
    const eq2 = await callPySRService([1], 'http://pysr');
    expect(eq1).toBe('x');
    expect(eq2).toBe('x');
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('throws when remote call fails', async () => {
    (axios.post as any).mockRejectedValueOnce(new Error('fail'));
    await expect(callPySRService([2], 'http://pysr')).rejects.toThrow('fail');
  });
});

