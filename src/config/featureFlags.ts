export const FEATURES = {
  resonancePanel: process.env.VITE_FEATURE_RESONANCE ?? "on",
  emergenceExplorer: process.env.VITE_FEATURE_EMERGENCE_EXPLORER ?? "off"
} as const;
