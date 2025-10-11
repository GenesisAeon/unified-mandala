export function CREPJUDGE(crep: { C: number; R: number; E: number; P: number }) {
  console.log('[CREPJUDGE] Bewertung', crep);
  return (crep.C + crep.R + crep.E + crep.P) / 4;
}
