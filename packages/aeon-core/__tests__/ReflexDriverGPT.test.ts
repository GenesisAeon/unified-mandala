import { describe, it, expect } from 'vitest';
import { ReflexDriverGPT } from '../ReflexDriverGPT';

describe('ReflexDriverGPT', () => {
  it('analyzes sensor data', async () => {
    const d = new ReflexDriverGPT({ id: 'r' });
    const res = await d.analyzeSensor('data');
    expect(res).toBe('analysis:data');
  });
});
