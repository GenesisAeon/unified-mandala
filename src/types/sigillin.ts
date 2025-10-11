export interface Sigillin {
  id: string;
  name?: string;
  crep?: {
    score?: number;
    parts?: { coherence: number; resonance: number; emergence: number; poetics: number };
  };
  connections?: string[];
  phase?: 'experimental' | 'stable' | 'canonical';
  metrics?: {
    connectionDensity: number;
    emergencePotential: number;
    lifecycle: 'alpha' | 'beta' | 'production';
  };
}
