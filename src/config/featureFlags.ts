export const FEATURES = {
  resonancePanel: (import.meta as any).env?.VITE_FEATURE_RESONANCE ?? "on",
  emergenceExplorer: (import.meta as any).env?.VITE_FEATURE_EMERGENCE_EXPLORER ?? "off",
  promptCoach: (import.meta as any).env?.VITE_FEATURE_PROMPT_COACH ?? "on"
} as const;

export const isOn = (flag: keyof typeof FEATURES) => `${FEATURES[flag]}` === "on";
