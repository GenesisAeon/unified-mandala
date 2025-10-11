export function soundResonanceVR(
  freq: number,
  amp: number,
  steps: number,
): { x: number; y: number; z: number }[] {
  const data: { x: number; y: number; z: number }[] = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * freq;
    data.push({
      x: Math.sin(angle) * amp,
      y: Math.cos(angle) * amp,
      z: Math.sin(angle * 0.5) * amp,
    });
  }
  return data;
}
