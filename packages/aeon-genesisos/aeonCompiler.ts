export function aeonCompiler(state: string): string {
  const map: Record<string, string> = {
    'β': 'γ',
    'γ': 'δ',
    'α': 'β',
  };
  return map[state] || state;
}
