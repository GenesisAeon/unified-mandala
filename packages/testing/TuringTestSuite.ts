export function isHumanLike(answer: string): boolean {
  const tokens = answer.split(/\s+/);
  return tokens.length > 3 && /[A-Za-z]/.test(answer);
}
