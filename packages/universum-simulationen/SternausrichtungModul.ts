export interface StarAlignment {
  star: string;
  azimuth: number;
}

export function isAligned(alignment: StarAlignment, threshold = 1): boolean {
  const target = 0; // reference azimuth
  return Math.abs(alignment.azimuth - target) <= threshold;
}
