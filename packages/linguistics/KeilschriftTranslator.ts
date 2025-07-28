const table: Record<string, string> = { a: '𒀀', b: '𒁀', c: '𒍝' };

export function toCuneiform(text: string): string {
  return text.split('').map(ch => table[ch] || ch).join('');
}

export function fromCuneiform(text: string): string {
  const reverse = Object.fromEntries(Object.entries(table).map(([k,v])=>[v,k]));
  return text.split('').map(ch => reverse[ch] || ch).join('');
}
