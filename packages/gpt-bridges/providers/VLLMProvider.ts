import { ModelProvider } from './ModelProvider';

/** vLLM provider calling the OpenAI-compatible completions API. */
export class VLLMProvider implements ModelProvider {
  readonly name = 'vllm';
  constructor(private baseUrl: string = 'http://localhost:8000/v1') {}

  async generate(model: string, prompt: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt }),
    });
    if (!res.ok) {
      throw new Error(`vLLM request failed with status ${res.status}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.text ?? '';
  }
}
