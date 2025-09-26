import express from 'express';
import path from 'path';
import { LocalEventBus, Subjects } from '../packages/event-bus';
import { ResearchHubWS } from '../packages/realtime';
import { RAGPipeline } from '../packages/rag/RAGPipeline';
import { ModelRouter } from '../packages/rag/AnswerComposer';

function resolvePort(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function main() {
  const bus = new LocalEventBus();
  const wsPort = resolvePort(process.env.REALTIME_WS_PORT ?? process.env.WS_PORT, 4021);
  new ResearchHubWS({ port: wsPort, bus });

  const STORE_DIR = process.env.RAG_STORE_DIR || path.join('data', 'rag');
  const DOC_PATH = path.join(STORE_DIR, 'docs.json');
  const VECTOR_PATH = path.join(STORE_DIR, 'vectors.json');

  const router: ModelRouter = {
    async generate(prompt: string) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) return '';
      const res = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-instruct',
          prompt,
          max_tokens: 200,
        }),
      });
      const json = await res.json();
      return json.choices?.[0]?.text?.trim() || '';
    },
  };

  const pipeline = new RAGPipeline({
    docPath: DOC_PATH,
    vectorPath: VECTOR_PATH,
    router,
  });

  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/live/ask', async (req, res) => {
    const { question, k } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'question required' });
    }
    bus.publish(Subjects.LIVE_ASK, { question });
    const answer = await pipeline.ask(question, k);
    bus.publish(Subjects.LIVE_ANSWER, { question, answer });
    res.json(answer);
  });

  const hubPort = resolvePort(process.env.REALTIME_HUB_PORT ?? process.env.PORT, 4020);
  app.listen(hubPort, () => {
    console.log(`Realtime hub listening on ${hubPort}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
