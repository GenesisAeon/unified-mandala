import fs from 'fs';
import path from 'path';
import RAGPipeline from '../packages/rag/RAGPipeline';
import { ModelRouter } from '../packages/rag/AnswerComposer';

describe('RAGPipeline flow', () => {
  const tmpDir = path.join(__dirname, 'tmp-rag');
  const docs = path.join(tmpDir, 'docs.json');
  const vectors = path.join(tmpDir, 'vectors.json');

  beforeEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('indexes and queries documents', async () => {
    const router: ModelRouter = {
      async generate(prompt: string) {
        expect(prompt).toContain('sky is blue');
        expect(prompt).toContain('Question: Why?');
        return 'Because [1]';
      },
    };
    const pipeline = new RAGPipeline({
      docPath: docs,
      vectorPath: vectors,
      router,
      chunkSize: 5,
    });
    await pipeline.index('doc', 'sky is blue', 'test');
    const res = await pipeline.ask('Why?');
    expect(res.answer).toBe('Because [1]');
    expect(res.citations[0].id).toBe('doc#0');
    expect(res.citations[0].source).toBe('test');
  });
});

