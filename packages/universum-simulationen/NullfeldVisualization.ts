export function generateCurvatureMap(curvatures: number[]): number[] {
  return curvatures.map(c => c * -1);
}

export function generateGalaxyMap(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `Galaxy-${i}`);
}

export function simulateDarkMatterDistribution(mass: number): number {
  const darkMatterFraction = 0.27;
  return mass * darkMatterFraction;
}
