// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (import.meta as any).env ?? {};
export const FEATURES = {
  resonancePanel: env.VITE_FEATURE_RESONANCE ?? "on",
  emergenceExplorer: env.VITE_FEATURE_EMERGENCE_EXPLORER ?? "off",
} as const;
