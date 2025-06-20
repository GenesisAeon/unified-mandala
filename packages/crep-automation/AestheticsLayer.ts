export function luminance(hex: string): number {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(fg: string, bg: string): number {
  return Math.abs(luminance(fg) - luminance(bg));
}

export function recommendedTextColor(bg: string): string {
  return luminance(bg) > 128 ? '#000' : '#fff';
}
