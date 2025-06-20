export function generateMotif(text: string): string {
  const first = text.split(/\s+/)[0] || '';
  return first ? `*${first}*` : '';
}
