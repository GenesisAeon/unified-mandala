export class ResonanceMapping {
  private dft(values: number[]): number[] {
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

  map(matrix: number[][]): number[] {
    if (matrix.length === 0) return [];
    const transforms = matrix.map(row => this.dft(row));
    const width = transforms[0].length;
    const agg = new Array(width).fill(0);
    transforms.forEach(t => {
      for (let i = 0; i < width; i++) {
        agg[i] += t[i];
      }
    });
    return agg.map(v => v / transforms.length);
  }
}
