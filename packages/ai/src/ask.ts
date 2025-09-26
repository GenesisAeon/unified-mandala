import type OpenAI from 'openai';
import { getOpenAI } from './client.js';

export type ChatMessageRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
}

export interface AskOpenAIParams {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  client?: OpenAI;
}

export interface AskOpenAIResult {
  text: string;
  finish_reason?: string;
  model: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
}

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4.1-mini';

type ResponseContent = {
  type?: string;
  text?: string;
};

type ResponseOutput = {
  content?: ResponseContent[];
  finish_reason?: string;
};

type ResponsesPayload = {
  output_text?: string;
  output?: ResponseOutput[];
  model?: string;
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
};

type ResponsesInputContent = {
  type: 'input_text' | 'output_text';
  text: string;
};

type ResponsesInputItem = {
  role: ChatMessageRole;
  content: ResponsesInputContent[];
};

function toResponsesContent(message: ChatMessage): ResponsesInputItem {
  const text = message.content?.toString() ?? '';

  const content: ResponsesInputContent = {
    type: message.role === 'assistant' ? 'output_text' : 'input_text',
    text
  };

  return {
    role: message.role,
    content: [content]
  };
}

function buildInput(messages: ChatMessage[]): ResponsesInputItem[] {
  return messages.map(toResponsesContent);
}

function extractText(payload: ResponsesPayload): string {
  if (typeof payload.output_text === 'string' && payload.output_text.trim().length > 0) {
    return payload.output_text.trim();
  }

  if (Array.isArray(payload.output)) {
    const text = payload.output
      .flatMap((item) => item.content ?? [])
      .map((part) => part?.text ?? '')
      .join('\n')
      .trim();
    if (text.length > 0) {
      return text;
    }
  }

  return '';
}

function extractFinishReason(payload: ResponsesPayload): string | undefined {
  if (!Array.isArray(payload.output) || payload.output.length === 0) {
    return undefined;
  }
  return payload.output[0]?.finish_reason ?? undefined;
}

export async function askOpenAI(params: AskOpenAIParams): Promise<AskOpenAIResult> {
  const {
    messages,
    model = DEFAULT_MODEL,
    temperature,
    max_tokens: maxTokens,
    client
  } = params;

  const resolvedClient = client ?? getOpenAI();
  const requestPayload: Record<string, unknown> = {
    model,
    input: buildInput(messages) as any
  };

  if (typeof temperature === 'number') {
    requestPayload.temperature = temperature;
  }

  if (typeof maxTokens === 'number') {
    requestPayload.max_output_tokens = maxTokens;
  }

  const response = (await resolvedClient.responses.create(requestPayload as any)) as ResponsesPayload;

  const text = extractText(response);
  const finishReason = extractFinishReason(response);

  return {
    text,
    finish_reason: finishReason,
    model: response.model ?? model,
    usage: response.usage
  };
}
