import { normalizeToolCalls, toProviderFormat, ToolCall } from './tool-adapter';

describe('ToolAdapter', () => {
  test('normalizes OpenAI tool calls', () => {
    const payload = {
      tool_calls: [
        { function: { name: 'weather', arguments: '{"city":"Berlin"}' } }
      ]
    };
    expect(normalizeToolCalls('openai', payload)).toEqual([
      { name: 'weather', args: { city: 'Berlin' } }
    ]);
  });

  test('normalizes Anthropic tool calls', () => {
    const payload = [
      { name: 'weather', input: { city: 'Berlin' } }
    ];
    expect(normalizeToolCalls('anthropic', payload)).toEqual([
      { name: 'weather', args: { city: 'Berlin' } }
    ]);
  });

  test('converts normalized calls to OpenAI format', () => {
    const calls: ToolCall[] = [{ name: 'weather', args: { city: 'Berlin' } }];
    expect(toProviderFormat('openai', calls)).toEqual([
      { type: 'function', function: { name: 'weather', arguments: '{"city":"Berlin"}' } }
    ]);
  });
});
