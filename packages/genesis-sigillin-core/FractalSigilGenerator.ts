export function generateFractalSigil(formula: string): string {
  const points = formula.split('').map((c, i) => {
    const angle = ((c.charCodeAt(0) * 137.5) % 360) * (Math.PI / 180);
    const radius = 10 + i * 2;
    const x = Number((radius * Math.cos(angle)).toFixed(2));
    const y = Number((radius * Math.sin(angle)).toFixed(2));
    return `${x},${y}`;
  }).join(' ');
  return `<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg"><polyline points="${points}" fill="none" stroke="currentColor"/></svg>`;
}
