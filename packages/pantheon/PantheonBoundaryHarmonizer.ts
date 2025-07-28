import { resolveHarmonic } from '../boundary-engine/BoundaryHarmonicResolver';

export class PantheonBoundaryHarmonizer {
  harmonize(rule: string): string {
    return resolveHarmonic(rule).toUpperCase();
  }
}
