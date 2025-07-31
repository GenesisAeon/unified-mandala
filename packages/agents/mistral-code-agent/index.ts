import { MistralAPI } from '../mistral-api-agent';

export class MistralCodeAgent {
  constructor(private api: MistralAPI) {}

  async createSnippet(prompt: string): Promise<string> {
    return this.api.generate(prompt);
  }
}
