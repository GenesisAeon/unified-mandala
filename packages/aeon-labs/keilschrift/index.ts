export function transliterate(text: string): string {
  return text.replace(/-/g, '');
}
