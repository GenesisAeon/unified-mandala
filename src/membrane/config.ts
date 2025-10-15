const parseNumber = (value: string | undefined, fallback: number) => {
  if (value === undefined) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toBool = (value: string | undefined, fallback = false) => {
  if (value === undefined) return fallback;
  if (value === '0' || value === 'false') return false;
  if (value === '1' || value === 'true') return true;
  return fallback;
};

export type MembraneMode = 'real' | 'null';

export const MEMBRANE_CFG = {
  N: parseNumber(process.env.MEMBRANE_N, 200),
  H: parseNumber(process.env.MEMBRANE_H, 0.2),
  K: parseNumber(process.env.MEMBRANE_K, 3),
  T_OK: parseNumber(process.env.MEMBRANE_TOK, 1.0),
  T_WARN: parseNumber(process.env.MEMBRANE_TWARN, 2.0),
  SIGMA_MIN: parseNumber(process.env.MEMBRANE_SIGMA_MIN, 1e-3),
  MODE: (process.env.MEMBRANE_MODE as MembraneMode | undefined) ?? 'real',
  CI_ASCII: process.env.CI === '1' || toBool(process.env.MEMBRANE_CI_ASCII),
} as const;

export const MEMBRANE_CACHE_TTL_MS = parseNumber(process.env.MEMBRANE_CACHE_TTL_MS, 15 * 60 * 1000);
