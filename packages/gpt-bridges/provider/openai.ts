export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIParams {
  model: string;
  messages: OpenAIMessage[];
}

const RESPONSES_URL = 'https://api.openai.com/v1/responses';
const CHAT_URL = 'https://api.openai.com/v1/chat/completions';

async function post(url: string, apiKey: string, body: unknown) {
  const init: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  };
  const res = await fetch(url, init);
  return res;
}

export async function callOpenAI({ model, messages }: OpenAIParams): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required');
  }
  try {
    const res = await post(RESPONSES_URL, apiKey, { model, input: messages });
    if (res.ok) {
      const json = await res.json();
      const text = json.output?.[0]?.content?.[0]?.text ?? json.output_text;
      if (typeof text === 'string') {
        return text;
      }
    }
  } catch {
    // ignore network errors and fall back
  }

  const res = await post(CHAT_URL, apiKey, { model, messages });
  if (!res.ok) {
    throw new Error(`OpenAI request failed with status ${res.status}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

export { RESPONSES_URL, CHAT_URL };
