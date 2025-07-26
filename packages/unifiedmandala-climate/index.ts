export function getClimateStatus(temp: number): string {
  return temp > 30 ? 'hot' : 'mild';
}
