import { ToolRegistry } from '../packages/gpt-bridges/tools/ToolRegistry';

describe('ToolRegistry', () => {
  it('registers, lists and invokes tools', async () => {
    const registry = new ToolRegistry();
    const spec = {
      name: 'echo',
      description: 'echoes text',
      parameters: {
        type: 'object',
        properties: { text: { type: 'string' } },
        required: ['text'],
        additionalProperties: false,
      },
    };
    registry.register(spec, ({ text }) => `echo:${text}`);

    expect(registry.list()).toEqual([{ type: 'function', function: spec }]);
    await expect(registry.invoke('echo', { text: 'hi' })).resolves.toBe('echo:hi');
  });

  it('validates arguments before invocation', async () => {
    const registry = new ToolRegistry();
    const spec = {
      name: 'echo',
      description: 'echoes text',
      parameters: {
        type: 'object',
        properties: { text: { type: 'string' } },
        required: ['text'],
        additionalProperties: false,
      },
    };
    registry.register(spec, ({ text }) => text);
    await expect(registry.invoke('echo', {} as any)).rejects.toThrow(/Invalid tool arguments/);
  });
});
