export const FEATURES = {
  resonancePanel: process.env.VITE_FEATURE_RESONANCE ?? "on",
  emergenceExplorer: process.env.VITE_FEATURE_EMERGENCE_EXPLORER ?? "off",
  promptCoach: process.env.VITE_FEATURE_PROMPT_COACH ?? "on"
} as const;

export const isOn = (flag: keyof typeof FEATURES) => `${FEATURES[flag]}` === "on";
