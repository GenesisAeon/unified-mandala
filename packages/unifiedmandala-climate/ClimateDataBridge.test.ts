import { describe, it, expect } from 'vitest';
import { fetchTemperatureData } from './ClimateDataBridge';

describe('fetchTemperatureData', () => {
  it('returns deterministic pseudo data', async () => {
    const first = await fetchTemperatureData('Berlin');
    const second = await fetchTemperatureData('Berlin');
    expect(first).toBe(second);
  });
});
