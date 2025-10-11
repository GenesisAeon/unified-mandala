export interface CREPEntry {
  C: number;
  R: number;
  E: number;
  P: number;
}

export function rateCREP({ C, R, E, P }: CREPEntry): 'low' | 'medium' | 'high' {
  const total = C + R + E + P;
  if (total >= 20) return 'high';
  if (total >= 10) return 'medium';
  return 'low';
}
