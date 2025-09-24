import OpenAI from 'openai';
import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  config();
}

function ensureApiKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key.trim().length === 0) {
    throw new Error('Missing OPENAI_API_KEY environment variable.');
  }
  return key;
}

export function createOpenAI(apiKey?: string): OpenAI {
  return new OpenAI({ apiKey: apiKey ?? ensureApiKey() });
}

let cachedClient: OpenAI | undefined;

export function getOpenAI(): OpenAI {
  if (!cachedClient) {
    cachedClient = createOpenAI();
  }
  return cachedClient;
}
