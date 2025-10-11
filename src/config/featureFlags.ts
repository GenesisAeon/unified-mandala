import { LOW_MEM } from './runtimeFlags';

export const FEATURES = {
  resonancePanel: (import.meta as any).env?.VITE_FEATURE_RESONANCE ?? 'on',
  emergenceExplorer: (import.meta as any).env?.VITE_FEATURE_EMERGENCE_EXPLORER ?? 'off',
  promptCoach: (import.meta as any).env?.VITE_FEATURE_PROMPT_COACH ?? 'on',
  membrane: LOW_MEM ? 'off' : ((import.meta as any).env?.VITE_FEATURE_MEMBRANE ?? 'on'),
} as const;

export const isOn = (flag: keyof typeof FEATURES) => `${FEATURES[flag]}` === 'on';
