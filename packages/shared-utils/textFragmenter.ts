import fs from 'fs';

/** Mapping of maximum token counts supported by each model. */
export const MAX_TOKENS_BY_MODEL: Record<string, number> = {
  'gpt-3.5': 16_000,
  'gpt-4': 32_000,
  'gpt-4.1': 128_000,
  // Placeholder for next generation models
  'gpt-5': 200_000,
};

/** Rough conversion ratio from tokens to characters. */
const CHARS_PER_TOKEN = 4;

/**
 * Splits a text into fragments of given max length in characters.
 * @param text The input text.
 * @param maxLength Maximum length of each fragment in characters.
 */
export function splitText(text: string, maxLength = 1000): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += maxLength) {
    chunks.push(text.slice(i, i + maxLength));
  }
  return chunks;
}

/**
 * Splits text based on the token limit of a model.
 * @param text The input text.
 * @param model Model name to derive token limit from.
 */
export function splitTextByModel(text: string, model: string): string[] {
  const maxTokens = MAX_TOKENS_BY_MODEL[model];
  if (!maxTokens) {
    throw new Error(`Unknown model: ${model}`);
  }
  const maxChars = maxTokens * CHARS_PER_TOKEN;
  return splitText(text, maxChars);
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

/**
 * Reads a file and splits based on the token limit of a model.
 * @param filePath Path to the text file.
 * @param model Model name to derive token limit from.
 */
export function splitFileByModel(filePath: string, model: string): string[] {
  const content = fs.readFileSync(filePath, 'utf8');
  return splitTextByModel(content, model);
}
