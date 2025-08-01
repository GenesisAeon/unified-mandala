import { runCollectiveAwakening } from '../mandala_collective_awakening';

describe('mandala_collective_awakening', () => {
  it('runs without throwing', () => {
    expect(() => runCollectiveAwakening()).not.toThrow();
  });
});
