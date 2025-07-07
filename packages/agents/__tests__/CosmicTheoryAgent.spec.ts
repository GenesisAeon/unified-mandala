import { describe, it, expect, vi, test } from 'vitest';
import axios from 'axios';
import { fetchCosmicData, analyzeCosmicData } from '../CosmicTheoryAgent';

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

