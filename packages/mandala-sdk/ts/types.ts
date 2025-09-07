export type PersonhoodLevel = 'P0' | 'P1' | 'P2' | 'P3';

export interface GovernanceInfo {
  level: PersonhoodLevel;
  compliant: boolean;
  ethics_approval: boolean;
  notes?: string;
}

export interface EventMessage<T = any> {
  topic: string;
  payload: T;
  crep_resonance?: number;
  sigil?: string;
  governance?: GovernanceInfo;
}
