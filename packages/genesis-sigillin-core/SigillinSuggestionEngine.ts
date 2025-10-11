import { SigillinGenerator } from './SigillinGenerator';

export function suggestSigillins(peaks: number[]): string[] {
  return peaks.map(
    (_, i) => SigillinGenerator(`suggestion-${i + 1}`, 'crep-trigger', 'draft', 'engine').id,
  );
}
