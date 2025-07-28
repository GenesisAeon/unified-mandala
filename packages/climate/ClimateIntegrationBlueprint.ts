export interface SolarForcingData {
  irradiance: number[];
  albedo: number[];
}

export function integrateSolarForcing(data: SolarForcingData): number {
  const avgIrradiance = data.irradiance.reduce((a,b)=>a+b,0) / data.irradiance.length;
  const avgAlbedo = data.albedo.reduce((a,b)=>a+b,0) / data.albedo.length;
  return avgIrradiance * (1 - avgAlbedo);
}
