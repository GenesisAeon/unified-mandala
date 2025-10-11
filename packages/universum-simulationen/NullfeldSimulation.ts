export interface NullfeldResult {
  totalForce: number;
  curvatureEffect: number;
  massFromEnergy: number;
}

/**
 * Simple null field simulation aggregating gravitational forces between masses,
 * applying a curvature factor and converting supplied energy to mass via E=mc^2.
 */
export function simulateNullfeld(
  masses: number[],
  curvature: number,
  energy: number,
): NullfeldResult {
  const G = 6.674e-11; // gravitational constant simplified
  let totalForce = 0;
  for (let i = 0; i < masses.length; i++) {
    for (let j = i + 1; j < masses.length; j++) {
      totalForce += G * masses[i] * masses[j];
    }
  }
  const curvatureEffect = totalForce * curvature;
  const c2 = 9e16; // speed of light squared (approx)
  const massFromEnergy = energy / c2;
  return { totalForce, curvatureEffect, massFromEnergy };
}
