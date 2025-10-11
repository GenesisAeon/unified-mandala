import axios from 'axios';

export class MistralAPI {
  constructor(
    private baseUrl: string,
    private apiKey: string,
  ) {}

  async generate(prompt: string): Promise<string> {
    const { data } = await axios.post(
      `${this.baseUrl}/generate`,
      { prompt },
      {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      },
    );
    return data.code || '';
  }
}
