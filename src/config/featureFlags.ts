import { LOW_MEM } from './runtimeFlags';

const normalizeToggle = (value?: unknown): 'on' | 'off' | undefined => {
  if (value === undefined || value === null) return undefined;
  const raw = String(value).toLowerCase();
  if (raw === '1' || raw === 'on' || raw === 'true' || raw === 'enabled') return 'on';
  if (raw === '0' || raw === 'off' || raw === 'false' || raw === 'disabled') return 'off';
  return undefined;
};

const runtimeMembranePreference = () => {
  if (typeof process === 'undefined') return undefined;
  return normalizeToggle(process.env.MEMBRANE_ON ?? process.env.VITE_FEATURE_MEMBRANE);
};

const metaMembranePreference = () =>
  normalizeToggle((import.meta as any)?.env?.VITE_FEATURE_MEMBRANE);

const membraneFromEnv = metaMembranePreference() ?? runtimeMembranePreference() ?? 'off';

export const FEATURES = {
  resonancePanel: (import.meta as any).env?.VITE_FEATURE_RESONANCE ?? 'on',
  emergenceExplorer: (import.meta as any).env?.VITE_FEATURE_EMERGENCE_EXPLORER ?? 'off',
  promptCoach: (import.meta as any).env?.VITE_FEATURE_PROMPT_COACH ?? 'on',
  membrane: LOW_MEM ? 'off' : membraneFromEnv,
} as const;

export const isOn = (flag: keyof typeof FEATURES) => `${FEATURES[flag]}` === 'on';
