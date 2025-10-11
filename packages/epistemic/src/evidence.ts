export type EvidenceSource = 'obs' | 'model' | 'expert' | 'proxy';
export interface Evidence {
  id: string;
  claim: string;
  datum: number | string | object;
  support: number; // 0..1
  quality: number; // 0..1
  source: EvidenceSource;
  ts: string;
  counter?: boolean;
}
