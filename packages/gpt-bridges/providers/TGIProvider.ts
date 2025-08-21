import { ModelProvider } from './ModelProvider';

/**
 * Text Generation Inference (TGI) provider.
 * Expects the HuggingFace TGI REST API.
 */
export class TGIProvider implements ModelProvider {
  readonly name = 'tgi';
  constructor(private baseUrl: string = 'http://localhost:8080') {}

  async generate(model: string, prompt: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt })
    });
    if (!res.ok) {
      throw new Error(`TGI request failed with status ${res.status}`);
    }
    const data = await res.json();
    return data.generated_text ?? '';
  }
}
