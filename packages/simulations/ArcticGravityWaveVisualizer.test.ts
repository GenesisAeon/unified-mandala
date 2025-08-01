import { visualizeWaves } from './ArcticGravityWaveVisualizer';

describe('ArcticGravityWaveVisualizer', () => {
  it('doubles values', () => {
    expect(visualizeWaves([1,2])).toEqual([2,4]);
  });
});
