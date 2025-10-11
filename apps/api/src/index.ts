import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { askOpenAI } from '@unified-mandala/ai';
import { requestAI } from './natsClient.js';
import ports from '@config/ports';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/healthz', (_req, res) => {
  res.json({ ok: true });
});
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const ChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string(),
      }),
    )
    .min(1),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().positive().optional(),
});

app.post('/api/ai/chat', async (req, res) => {
  const parsed = ChatSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }

  const useNats = (process.env.AI_TRANSPORT || 'direct') === 'nats';

  try {
    const payload = parsed.data;
    const result = useNats ? await requestAI(payload) : await askOpenAI(payload);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

const port = ports.ai;
if (process.env.NODE_ENV !== 'test' && process.env.VITEST !== '1') {
  app.listen(port, () => {
    console.log(`[api] listening on http://localhost:${port}`);
  });
}

export { app, ChatSchema };
