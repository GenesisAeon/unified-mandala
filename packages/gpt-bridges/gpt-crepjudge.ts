export function GPT_CREPJUDGE(crep: { C: number; R: number; E: number }) {
  if (crep.C < 4 || crep.R < 4 || crep.E < 4) return '⚠️ Zustand kritisch';
  if (crep.C >= 7 && crep.R >= 7 && crep.E >= 7) return '🟢 Zustand stabil';
  return '🟠 Zustand unsicher';
}
