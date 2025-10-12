let __nats: any;
async function loadNats() {
  if (__nats) return __nats;
  const injected = (globalThis as any).__UM_TEST_NATS;
  if (injected) return (__nats = injected);
  return (__nats = await import('nats'));
}
import { z } from 'zod';
import { askOpenAI, type AskOpenAIParams } from './index.js';

const MessageSchema = z.object({
  role: z.union([z.literal('system'), z.literal('user'), z.literal('assistant')]),
  content: z.string().min(1),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema).min(1),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().positive().optional(),
});

async function handleRequest(data: Uint8Array) {
  const { StringCodec } = await loadNats();
  const sc = StringCodec();
  const payload = JSON.parse(sc.decode(data));
  const parsed = RequestSchema.parse(payload);
  const params: AskOpenAIParams = {
    messages: parsed.messages,
    model: parsed.model,
    temperature: parsed.temperature,
    max_tokens: parsed.max_tokens,
  };
  return askOpenAI(params);
}

async function main() {
  const subject = process.env.NATS_SUBJECT || 'ai.request';
  const servers = process.env.NATS_URL || 'nats://localhost:4222';

  const { connect, StringCodec } = await loadNats();
  const connection = await connect({ servers });
  console.log(`[ai-worker] listening on ${subject} (${servers})`);

  const subscription = connection.subscribe(subject);
  for await (const message of subscription) {
    try {
      const result = await handleRequest(message.data);
      const sc = StringCodec();
      message.respond(sc.encode(JSON.stringify({ ok: true, result })));
    } catch (error) {
      console.error('[ai-worker] request failed:', error);
      const sc = StringCodec();
      message.respond(
        sc.encode(
          JSON.stringify({
            ok: false,
            error: error instanceof Error ? error.message : String(error),
          }),
        ),
      );
    }
  }
}

main().catch((error) => {
  console.error('[ai-worker] fatal error:', error);
  process.exitCode = 1;
});
