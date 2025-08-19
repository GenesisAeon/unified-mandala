export interface ToolCall {
  name: string;
  args: Record<string, unknown>;
}

/**
 * Normalizes provider specific tool call structures into a unified format.
 */
export function normalizeToolCalls(provider: string, payload: any): ToolCall[] {
  if (!payload) return [];
  if (provider === 'openai') {
    const calls = payload.tool_calls || [];
    return calls.map((c: any) => ({
      name: c.function?.name ?? '',
      args: safeParse(c.function?.arguments)
    }));
  }
  if (provider === 'anthropic') {
    const calls = Array.isArray(payload) ? payload : payload.tool_calls || [];
    return calls.map((c: any) => ({
      name: c.name || '',
      args: c.input || {}
    }));
  }
  const calls = Array.isArray(payload.tool_calls) ? payload.tool_calls : Array.isArray(payload) ? payload : [];
  return calls.map((c: any) => ({ name: c.name || '', args: c.args || {} }));
}

function safeParse(str: any): Record<string, unknown> {
  if (typeof str !== 'string') return str || {};
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

/**
 * Converts normalized tool calls back to provider specific structures.
 */
export function toProviderFormat(provider: string, calls: ToolCall[]): any[] {
  if (provider === 'openai') {
    return calls.map((c) => ({
      type: 'function',
      function: { name: c.name, arguments: JSON.stringify(c.args) }
    }));
  }
  if (provider === 'anthropic') {
    return calls.map((c) => ({ name: c.name, input: c.args }));
  }
  return calls.map((c) => ({ name: c.name, args: c.args }));
}
