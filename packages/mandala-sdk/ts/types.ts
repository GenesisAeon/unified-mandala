export type Personhood = 'P0' | 'P1' | 'P2' | 'P3';

export interface Governance {
  level?: Personhood;
  compliant?: boolean;
  ethics_approval?: boolean;
  notes?: string;
}

export interface ActorRef {
  id: string;
  role: string;
}

export interface MandalaEvent<T = any> {
  id: string;
  topic: string;
  actor: ActorRef;
  ts: string;
  personhood?: Personhood;
  governance?: Governance;
  sigil?: string;
  crep_resonance?: number;
  payload: T;
}
