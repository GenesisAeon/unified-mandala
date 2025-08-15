export interface StyleOptions {
  language?: string;
  style?: 'formal' | 'informal' | 'poetic';
}

/**
 * Adapts a text response to match user language and stylistic preferences.
 * This lightweight utility performs simple replacements and embellishments
 * without relying on external services. It is intentionally limited but
 * provides a clear extension point for future sophistication.
 */
export function adaptStyle(text: string, opts: StyleOptions = {}): string {
  let result = text.trim();

  switch (opts.style) {
    case 'formal':
      // Replace a few common contractions
      result = result
        .replace(/\bcan't\b/gi, 'cannot')
        .replace(/\bwon't\b/gi, 'will not')
        .replace(/\bdon't\b/gi, 'do not');
      break;
    case 'informal':
      result = result + ' :)';
      break;
    case 'poetic':
      result = result.replace(/\./g, ',') + ' ~';
      break;
  }

  if (opts.language === 'de') {
    const dict: Record<string, string> = {
      'Hello': 'Hallo',
      'world': 'Welt'
    };
    Object.entries(dict).forEach(([en, de]) => {
      const re = new RegExp(`\\b${en}\\b`, 'gi');
      result = result.replace(re, de);
    });
  }

  return result;
}

export default adaptStyle;
