export class ExtendedResonanceVRModule {
  applyFeedback(value: number): number {
    return value + 0.1;
  }

  applyFourier(values: number[]): number[] {
    const n = values.length;
    const result: number[] = [];
    for (let k = 0; k < n; k++) {
      let re = 0;
      let im = 0;
      for (let t = 0; t < n; t++) {
        const angle = (2 * Math.PI * t * k) / n;
        re += values[t] * Math.cos(angle);
        im -= values[t] * Math.sin(angle);
      }
      result.push(Math.sqrt(re * re + im * im) / n);
    }
    return result;
  }
}
