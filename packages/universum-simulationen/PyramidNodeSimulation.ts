export interface PyramidStep {
  time: number;
  energy: number;
}

export function pyramidNodeSimulation(steps: number): PyramidStep[] {
  const result: PyramidStep[] = [];
  let energy = 1;
  for (let t = 0; t < steps; t++) {
    energy += Math.log(t + 1);
    result.push({ time: t, energy });
  }
  return result;
}
