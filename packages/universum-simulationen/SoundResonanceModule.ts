export function soundResonance(freq: number, amp: number, steps: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < steps; i++) {
    result.push(Math.sin((i / steps) * freq) * amp);
  }
  return result;
}
