export interface SimulationResult {
  summary: string;
}

export function simulateBoundaryLaws(laws: string[], steps = 1): SimulationResult {
  let state = [...laws];
  for (let i = 0; i < steps; i++) {
    state = state.map(l => `${l}-${i}`);
  }
  return { summary: state.join(',') };
}
