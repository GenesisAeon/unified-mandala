export function emergenceClass(v) {
  if (v >= 0.75) return 'high';
  if (v >= 0.4) return 'medium';
  return 'low';
}
