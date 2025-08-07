export interface NullfeldParameters {
  mass1: number;
  mass2: number;
  distance: number;
  membraneEnergy: number;
}

export function gravitationalForce({ mass1, mass2, distance }: NullfeldParameters): number {
  const G = 6.674e-11;
  return (G * mass1 * mass2) / (distance * distance);
}

export function membraneCurvature(energy: number): number {
  const k = 0.1;
  return k * energy;
}

export function energyConversion(energy: number): number {
  const efficiency = 0.42;
  return energy * efficiency;
}
