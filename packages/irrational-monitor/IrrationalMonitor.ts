export type IrrationalConstant = 'pi' | 'e' | 'phi';

const CONSTANTS: Record<IrrationalConstant, number> = {
  pi: Math.PI,
  e: Math.E,
  phi: (1 + Math.sqrt(5)) / 2,
};

export class IrrationalMonitor {
  static expected(name: IrrationalConstant): number {
    return CONSTANTS[name];
  }

  static isDeviation(name: IrrationalConstant, measured: number, tolerance = 1e-6): boolean {
    const expected = IrrationalMonitor.expected(name);
    return Math.abs(expected - measured) > tolerance;
  }
}
