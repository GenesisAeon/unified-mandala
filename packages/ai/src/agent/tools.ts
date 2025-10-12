import { askOpenAI, type ChatMessage } from '../ask.js';
import { readFileURI, writeFileURI } from '../guards/guardedFs.js';


async function runtimeChat(messages: ChatMessage[]) {
  // Prefer HTTP transport when a fetch implementation is present and callable.
  // Tests can stub fetch; in production, this hits the local API gateway.
  const gfetch = (globalThis as any).fetch as typeof fetch | undefined;
  if (typeof gfetch === 'function') {
    const endpoint = process.env.MANDALA_AI_HTTP ?? 'http://localhost:3000/api/ai/chat';
    const response = await gfetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`runtime.chat failed (${response.status}): ${detail}`);
    }

    return response.json();
  }

  // Fallback: use the local OpenAI client when fetch is not available.
  return askOpenAI({ messages });
}

type ToolHandler = (args: Record<string, unknown>) => Promise<unknown>;

export const tools: Record<string, ToolHandler> = {
  async 'repo.read'(args) {
    const path = String(args?.path ?? '');
    if (!path) {
      throw new Error('repo.read requires a path');
    }
    return readFileURI(`repo://${path}`);
  },
  async 'git.propose_patch'(_args) {
    throw new Error('git.propose_patch is routed via external PR automation.');
  },
  async 'scratch.write'(args) {
    const path = String(args?.path ?? '');
    const data = String(args?.data ?? '');
    if (!path) {
      throw new Error('scratch.write requires a path');
    }
    return writeFileURI(`scratch://${path}`, data);
  },
  async 'runtime.chat'(args) {
    const messages = Array.isArray(args?.messages) ? (args.messages as ChatMessage[]) : [];
    if (messages.length === 0) {
      throw new Error('runtime.chat requires at least one message');
    }
    return runtimeChat(messages);
  },
};
