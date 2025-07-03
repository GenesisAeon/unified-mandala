export interface FormatOptions {
  letterSpacing?: number;
  fontFamily?: string;
  syllableSeparator?: string;
}

export function formatForDyslexia(text: string, options: FormatOptions = {}): string {
  const { letterSpacing = 0.15, fontFamily = 'OpenDyslexic, Arial', syllableSeparator } = options;
  let processed = text;
  if (syllableSeparator) {
    const vowel = /[aeiouäöüAEIOUÄÖÜyY]/;
    let idx = -1;
    for (let i = 0; i < text.length - 1; i++) {
      if (vowel.test(text[i])) {
        idx = i + 1;
        if (idx < text.length && !vowel.test(text[idx])) {
          idx += 1;
        }
        break;
      }
    }
    if (idx !== -1) {
      processed = text.slice(0, idx) + syllableSeparator + text.slice(idx);
    }
  }
  const style = `font-family:${fontFamily};letter-spacing:${letterSpacing}em;`;
  return `<span style="${style}">${processed}</span>`;
}
