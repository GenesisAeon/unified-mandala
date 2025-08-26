/**
 * Selects "green" options from a candidate list.
 * In a real system this would apply sustainability heuristics.
 */
export function evolveGreen(options: string[]): string[] {
  return options.filter(o => /green/i.test(o));
}

export default evolveGreen;
