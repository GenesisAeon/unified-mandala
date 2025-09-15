import { LOW_MEM } from "./runtimeFlags";

type FlagState = "on" | "off";

const envSources: Record<string, unknown>[] = [];

if (typeof process !== "undefined" && typeof process.env === "object") {
  envSources.push(process.env as Record<string, unknown>);
}

if (typeof import.meta !== "undefined" && (import.meta as any).env) {
  envSources.push((import.meta as any).env as Record<string, unknown>);
}

const readEnv = (key: string) => {
  for (const source of envSources) {
    const raw = source[key];
    if (typeof raw === "string") {
      return raw;
    }
  }
  return undefined;
};

const normalize = (value: string | undefined, fallback: FlagState): FlagState => {
  if (!value) {
    return fallback;
  }

  const normalized = value.toLowerCase();
  if (["on", "true", "1", "enabled"].includes(normalized)) {
    return "on";
  }
  if (["off", "false", "0", "disabled"].includes(normalized)) {
    return "off";
  }
  return fallback;
};

const flag = (keys: string[], fallback: FlagState): FlagState => {
  for (const key of keys) {
    const value = readEnv(key);
    if (value !== undefined) {
      return normalize(value, fallback);
    }
  }
  return fallback;
};

export const FEATURES = {
  resonancePanel: flag(["UM_FEATURE_RESONANCE", "VITE_FEATURE_RESONANCE"], "on"),
  emergenceExplorer: flag(["UM_FEATURE_EMERGENCE_EXPLORER", "VITE_FEATURE_EMERGENCE_EXPLORER"], "off"),
  promptCoach: flag(["UM_FEATURE_PROMPT_COACH", "VITE_FEATURE_PROMPT_COACH"], "on"),
  membrane: LOW_MEM ? "off" : flag(["UM_FEATURE_MEMBRANE", "VITE_FEATURE_MEMBRANE"], "on"),
  climateCore: flag(["UM_FEATURE_CLIMATE_CORE"], "on"),
  universeSimulation: flag(["UM_FEATURE_UNIVERSE_SIM", "ENABLE_UNIVERSE_SIM", "VITE_FEATURE_UNIVERSE_SIM"], "off"),
  quantumBridge: flag(["UM_FEATURE_QUANTUM", "ENABLE_QUANTUM", "VITE_FEATURE_QUANTUM"], "off"),
  telemetry: flag(["UM_FEATURE_TELEMETRY", "ENABLE_TELEMETRY"], "off"),
} as const;

export type FeatureFlagName = keyof typeof FEATURES;

export const isOn = (flag: FeatureFlagName) => `${FEATURES[flag]}` === "on";

export const whenFeature = <T>(flag: FeatureFlagName, onValue: T, offValue: T) => (isOn(flag) ? onValue : offValue);
