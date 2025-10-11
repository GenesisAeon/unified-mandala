import { chunkText } from './Chunker';
import { createEmbedder, Embedder } from './Embedder';
import { DocStore, DocRecord } from './DocStore';
import { VectorStore } from './VectorStore';
import { AnswerComposer, ModelRouter, AnswerResult } from './AnswerComposer';

export interface RAGPipelineOptions {
  docPath: string;
  vectorPath: string;
  router: ModelRouter;
  embedder?: Embedder;
  chunkSize?: number;
  overlap?: number;
}

/**
 * RAGPipeline ties together chunking, embedding, vector storage and answer
 * composition. It provides simple index and query helpers and is intended as a
 * minimal building block for further extensions like personhood guards and
 * auditing.
 */
export class RAGPipeline {
  private readonly docStore: DocStore;
  private readonly vectorStore: VectorStore;
  private readonly embedder: Embedder;
  private readonly composer: AnswerComposer;
  private readonly chunkSize: number;
  private readonly overlap: number;

  constructor(opts: RAGPipelineOptions) {
    this.docStore = new DocStore(opts.docPath);
    this.vectorStore = new VectorStore(opts.vectorPath);
    this.embedder = opts.embedder ?? createEmbedder();
    this.composer = new AnswerComposer(opts.router);
    this.chunkSize = opts.chunkSize ?? 200;
    this.overlap = opts.overlap ?? 0;
  }

  /**
   * Index a document into the pipeline. The document is chunked, embedded and
   * stored in both the DocStore and VectorStore.
   */
  async index(id: string, text: string, source?: string): Promise<void> {
    const chunks = chunkText(text, this.chunkSize, this.overlap);
    let idx = 0;
    for (const chunk of chunks) {
      const chunkId = `${id}#${idx++}`;
      this.docStore.add({ id: chunkId, text: chunk.text, source });
      const vector = await this.embedder.embed(chunk.text);
      this.vectorStore.add(chunkId, vector);
    }
  }

  /**
   * Query the pipeline using the provided question. The top `k` matching
   * chunks are fetched and passed to the AnswerComposer.
   */
  async ask(question: string, k = 3): Promise<AnswerResult> {
    const queryVec = await this.embedder.embed(question);
    const hits = this.vectorStore.search(queryVec, k);
    const docs: DocRecord[] = [];
    for (const hit of hits) {
      const doc = this.docStore.get(hit.id);
      if (doc) docs.push(doc);
    }
    return this.composer.compose(question, docs);
  }
}

export default RAGPipeline;
