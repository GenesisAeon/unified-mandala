export function computeMetrics(messages: string[]): {frequency: number; depth: number} {
  const frequency = messages.length;
  const depth = messages.reduce((a, m) => a + m.length, 0);
  return { frequency, depth };
}
