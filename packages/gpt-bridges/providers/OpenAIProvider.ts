import { ModelProvider } from './ModelProvider';

/**
 * OpenAI provider that uses the Responses API when enabled and
 * falls back to the chat completions endpoint.
 */
export class OpenAIProvider implements ModelProvider {
  readonly name = 'openai';

  constructor(
    private apiKey: string = process.env.OPENAI_API_KEY || '',
    private baseUrl: string = 'https://api.openai.com/v1',
  ) {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY is required');
    }
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`OpenAI request failed with status ${res.status}`);
    }
    return (await res.json()) as T;
  }

  async generate(model: string, prompt: string): Promise<string> {
    const useResponses = process.env.USE_RESPONSES_API === '1';
    if (useResponses) {
      try {
        const data: any = await this.post('/responses', {
          model,
          input: [{ role: 'user', content: prompt }],
        });
        const text = data.output?.[0]?.content?.[0]?.text ?? data.output_text;
        if (typeof text === 'string') {
          return text;
        }
      } catch {
        // ignore and fall back to chat completions
      }
    }
    const data: any = await this.post('/chat/completions', {
      model,
      messages: [{ role: 'user', content: prompt }],
    });
    return data.choices?.[0]?.message?.content ?? '';
  }
}

export default OpenAIProvider;
