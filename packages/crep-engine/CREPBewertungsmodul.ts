export interface BewertungsInput {
  C: number;
  R: number;
  E: number;
  P: number;
}

export class CREPBewertungsmodul {
  static berechneScore({ C, R, E, P }: BewertungsInput): number {
    return (C + R + E + P) / 4;
  }

  static klassifiziere(score: number): 'niedrig' | 'mittel' | 'hoch' {
    if (score >= 7) return 'hoch';
    if (score >= 4) return 'mittel';
    return 'niedrig';
  }
}
