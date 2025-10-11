import { ModelProvider } from './ModelProvider';

/** Simple Ollama provider calling the local Ollama HTTP API. */
export class OllamaProvider implements ModelProvider {
  readonly name = 'ollama';
  constructor(private baseUrl: string = 'http://localhost:11434') {}

  async generate(model: string, prompt: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt }),
    });
    if (!res.ok) {
      throw new Error(`Ollama request failed with status ${res.status}`);
    }
    const data = await res.json();
    return data.response ?? '';
  }
}
