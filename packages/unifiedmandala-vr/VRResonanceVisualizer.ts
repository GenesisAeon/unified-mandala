export class VRResonanceVisualizer {
  computeColor(crep: number): string {
    const val = Math.max(0, Math.min(1, crep));
    const r = Math.round(255 * val);
    const g = Math.round(255 * (1 - val));
    return `rgb(${r},${g},128)`;
  }
}
