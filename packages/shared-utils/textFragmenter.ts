import fs from 'fs';

/**
 * Splits a text into fragments of given max length.
 * @param text The input text.
 * @param maxLength Maximum length of each fragment.
 */
export function splitText(text: string, maxLength = 1000): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += maxLength) {
    chunks.push(text.slice(i, i + maxLength));
  }
  return chunks;
}

/**
 * Reads a file and splits its content into fragments.
 * @param filePath Path to the text file.
 * @param maxLength Maximum length of each fragment.
 */
export function splitFile(filePath: string, maxLength = 1000): string[] {
  const content = fs.readFileSync(filePath, 'utf8');
  return splitText(content, maxLength);
}
