/** Simple mapping from memory weight to a symbolic tone name */
export function memoryToTone(weight: number): string {
  if (weight > 0.7) return 'high';
  if (weight > 0.3) return 'mid';
  return 'low';
}
