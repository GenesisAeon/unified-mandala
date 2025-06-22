/**
 * Simple sine based pulse simulation for emergent values.
 */
export function simulatePulse(start: number, steps: number): number[] {
  const values: number[] = [];
  let v = start;
  for (let i = 0; i < steps; i++) {
    v = Math.sin(v + i / 10);
    values.push(v);
  }
  return values;
}
