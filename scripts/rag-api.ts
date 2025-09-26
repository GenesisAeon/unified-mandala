import express from 'express';
import path from 'path';
import { RAGPipeline } from '../packages/rag/RAGPipeline';
import { ModelRouter } from '../packages/rag/AnswerComposer';
import { createEmbedder } from '../packages/rag/Embedder';
import { VectorStore } from '../packages/rag/VectorStore';
import { DocStore } from '../packages/rag/DocStore';

function resolvePort(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const STORE_DIR = process.env.RAG_STORE_DIR || path.join('data', 'rag');
const DOC_PATH = path.join(STORE_DIR, 'docs.json');
const VECTOR_PATH = path.join(STORE_DIR, 'vectors.json');

const router: ModelRouter = {
  async generate(prompt: string) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return 'Model router not configured';
    }
    try {
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
    } catch (err) {
      console.error('Model request failed', err);
      return '';
    }
  },
};

const pipeline = new RAGPipeline({
  docPath: DOC_PATH,
  vectorPath: VECTOR_PATH,
  router,
});

const embedder = createEmbedder();
const vectorStore = new VectorStore(VECTOR_PATH);
const docStore = new DocStore(DOC_PATH);

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/index', async (req, res) => {
  const { id, text, source } = req.body;
  if (!id || !text) {
    return res.status(400).json({ error: 'id and text required' });
  }
  await pipeline.index(id, text, source);
  res.json({ status: 'ok' });
});

app.get('/search', async (req, res) => {
  const q = req.query.q as string;
  const k = parseInt((req.query.k as string) || '5', 10);
  if (!q) return res.status(400).json({ error: 'q required' });
  const qVec = await embedder.embed(q);
  const hits = vectorStore.search(qVec, k);
  const results = hits.map(({ id, score }) => ({
    id,
    score,
    text: docStore.get(id)?.text,
    source: docStore.get(id)?.source,
  }));
  res.json({ results });
});

app.post('/ask', async (req, res) => {
  const { question, k } = req.body;
  if (!question) return res.status(400).json({ error: 'question required' });
  const answer = await pipeline.ask(question, k);
  res.json(answer);
});

const ragPort = resolvePort(process.env.RAG_API_PORT ?? process.env.PORT, 3000);
app.listen(ragPort, () => {
  console.log(`RAG API server listening on ${ragPort}`);
});
