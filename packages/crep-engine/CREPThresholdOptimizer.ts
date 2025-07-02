export function optimizeThreshold(values: number[], current: number): number {
  if (values.length === 0) return current;
  const avg = values.reduce((a,b)=>a+b,0)/values.length;
  return (current + avg) / 2;
}
