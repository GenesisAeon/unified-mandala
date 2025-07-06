import { describe, it, expect, vi } from 'vitest';
import axios from 'axios';
import { fetchCosmicData } from '../CosmicTheoryAgent';

vi.mock('axios');

describe('fetchCosmicData', () => {
  it('throws on network error', async () => {
    (axios.get as any).mockRejectedValueOnce(new Error('Network Error'));
    await expect(fetchCosmicData('http://example.com')).rejects.toThrow('Network Error');
  });
});

