import { toolRegistry } from '../tools/ToolRegistry';
import { normalizeToolCalls, ToolCall } from '../tool-adapter';

export interface ChatMessage {
  role: string;
  content: string;
  name?: string;
}

export interface ChatModel {
  (payload: { messages: ChatMessage[]; tools?: any[] }): Promise<any>;
}

/**
 * Iterates model responses and executes registered tools until no tool calls remain.
 */
export async function chatWithTools(
  model: ChatModel,
  options: { messages: ChatMessage[]; provider?: string },
): Promise<any> {
  const { provider = 'openai' } = options;
  const history = [...options.messages];
  while (true) {
    const response = await model({ messages: history, tools: toolRegistry.list() });
    const calls: ToolCall[] = normalizeToolCalls(provider, response as any);
    if (!calls.length) {
      return response;
    }
    for (const call of calls) {
      const result = await toolRegistry.invoke(call.name, call.args);
      history.push({ role: 'tool', name: call.name, content: JSON.stringify(result) });
    }
  }
}
