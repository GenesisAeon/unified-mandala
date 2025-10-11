export type Strength = 'inconclusive' | 'weak' | 'moderate' | 'strong' | 'decisive';
export function bayesFactor(pro: number[], contra: number[]): number {
  const clamp = (x: number) => Math.max(1e-6, Math.min(1, x));
  const P = pro.reduce((a, b) => a * clamp(b), 1);
  const C = contra.reduce((a, b) => a * clamp(b), 1);
  return P / C;
}
export function jeffreys(bf: number): Strength {
  if (bf < 1) return 'inconclusive';
  if (bf < 3) return 'weak';
  if (bf < 10) return 'moderate';
  if (bf < 30) return 'strong';
  return 'decisive';
}
