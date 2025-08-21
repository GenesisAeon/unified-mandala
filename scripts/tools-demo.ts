import { chatWithTools } from '../packages/gpt-bridges/router/callWithTools';
import { toolRegistry } from '../packages/gpt-bridges/tools/ToolRegistry';

// Register a simple echo tool
toolRegistry.register(
  {
    name: 'echo',
    description: 'returns the provided text',
    parameters: {
      type: 'object',
      properties: { text: { type: 'string' } },
      required: ['text']
    }
  },
  ({ text }) => `echo: ${text}`
);

// Mock model that triggers the echo tool on first call
async function mockModel(payload: any): Promise<any> {
  if (!payload.__called) {
    payload.__called = true;
    return { tool_calls: [{ name: 'echo', args: { text: 'hello' } }] };
  }
  return { content: 'echo: hello' };
}

async function main() {
  const res = await chatWithTools(mockModel, {
    messages: [{ role: 'user', content: 'say hello' }],
    provider: 'local'
  });
  console.log(res);
}

main().catch(console.error);
