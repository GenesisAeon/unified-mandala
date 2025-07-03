export function goldenRatio(value: number): number {
  const phi = (1 + Math.sqrt(5)) / 2;
  return value * phi;
}

export function fibonacci(n: number): number {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}
