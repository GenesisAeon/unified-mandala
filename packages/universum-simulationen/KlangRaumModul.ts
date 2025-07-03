export function resonanceFrequency(length: number): number {
  const speedOfSound = 343; // m/s
  return speedOfSound / (2 * length);
}
