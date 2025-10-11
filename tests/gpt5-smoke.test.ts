/*
 * GPT-5 smoke test suite.
 * These tests verify core capabilities of the gpt-5 model using the
 * OpenAI Responses API. They are skipped automatically when no
 * OPENAI_API_KEY is provided.
 */

const apiKey = process.env.OPENAI_API_KEY;
const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

// Skip the entire suite if no API key is configured.
const describeIf = apiKey ? describe : describe.skip;

describeIf('gpt-5 smoke suite', () => {
  async function callOpenAI(path: string, body: any) {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    expect(res.ok).toBe(true);
    return (await res.json()) as any;
  }

  test('performs JSON tool call', async () => {
    const result = await callOpenAI('/responses', {
      model: 'gpt-5',
      input: [{ role: 'user', content: 'Add 2 and 3.' }],
      tools: [
        {
          type: 'function',
          function: {
            name: 'add',
            parameters: {
              type: 'object',
              properties: {
                a: { type: 'number' },
                b: { type: 'number' },
              },
              required: ['a', 'b'],
            },
          },
        },
      ],
      tool_choice: { type: 'function', function: { name: 'add' } },
    });
    expect(result.output).toBeDefined();
  });

  test('answers using provided context', async () => {
    const result = await callOpenAI('/responses', {
      model: 'gpt-5',
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: 'Context: The sky is blue.\nQuestion: What color is the sky?',
            },
          ],
        },
      ],
    });
    const text = result.output_text || result.output?.[0]?.content?.[0]?.text;
    expect(typeof text).toBe('string');
  });

  test('generates an image caption', async () => {
    const result = await callOpenAI('/responses', {
      model: 'gpt-5',
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_image',
              image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg',
            },
            { type: 'input_text', text: 'Describe the image' },
          ],
        },
      ],
    });
    const text = result.output_text || result.output?.[0]?.content?.[0]?.text;
    expect(typeof text).toBe('string');
  });
});
