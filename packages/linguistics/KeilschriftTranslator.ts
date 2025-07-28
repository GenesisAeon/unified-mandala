const mapping: Record<string, string> = {
  'A': '\u12000',
  'B': '\u12001'
};

export function toCuneiform(text: string): string {
  return text.split('').map(ch => mapping[ch] || ch).join('');
}
