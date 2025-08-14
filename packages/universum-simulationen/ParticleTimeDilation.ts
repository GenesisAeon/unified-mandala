export interface ParticleTimeDilationParams {
  velocityFraction: number; // velocity as fraction of speed of light (0-1)
  energy: number; // energy in joules converted to mass
}

const SPEED_OF_LIGHT = 299792458; // m/s
const AIR_DENSITY = 1.225; // kg/m^3 at sea level

export interface ParticleTimeDilationResult {
  timeFactor: number;
  convertedMass: number;
  gasVolume: number;
}

export function simulateParticleTimeDilation(
  params: ParticleTimeDilationParams,
): ParticleTimeDilationResult {
  const v = params.velocityFraction * SPEED_OF_LIGHT;
  const gamma = 1 / Math.sqrt(1 - (v * v) / (SPEED_OF_LIGHT * SPEED_OF_LIGHT));
  const convertedMass = params.energy / (SPEED_OF_LIGHT * SPEED_OF_LIGHT);
  const gasVolume = convertedMass / AIR_DENSITY;
  return { timeFactor: gamma, convertedMass, gasVolume };
}
