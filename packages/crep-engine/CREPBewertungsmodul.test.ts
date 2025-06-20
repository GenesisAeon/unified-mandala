import { CREPBewertungsmodul } from './CREPBewertungsmodul';

describe('CREPBewertungsmodul', () => {
  it('berechnet Durchschnitt und klassifiziert', () => {
    const score = CREPBewertungsmodul.berechneScore({ C:8, R:8, E:8, P:8 });
    expect(score).toBe(8);
    expect(CREPBewertungsmodul.klassifiziere(score)).toBe('hoch');
  });
});
