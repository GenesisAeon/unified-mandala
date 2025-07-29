export class BoundaryWaveSimulator {
  simulate(initial: number, steps: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < steps; i++) {
      const value = initial * Math.sin((i / steps) * Math.PI * 2);
      result.push(parseFloat(value.toFixed(3)));
    }
    return result;
  }
}
