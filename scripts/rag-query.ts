import path from 'path';
import { createEmbedder } from '../packages/rag/Embedder';
import { VectorStore } from '../packages/rag/VectorStore';
import { DocStore } from '../packages/rag/DocStore';

const STORE_DIR = process.env.RAG_STORE_DIR || path.join('data', 'rag');
const VECTOR_PATH = path.join(STORE_DIR, 'vectors.json');
const DOC_PATH = path.join(STORE_DIR, 'docs.json');

async function queryIndex(query: string, k = 5) {
  const embedder = createEmbedder();
  const vectorStore = new VectorStore(VECTOR_PATH);
  const docStore = new DocStore(DOC_PATH);
  const qVec = await embedder.embed(query);
  const results = vectorStore.search(qVec, k);
  results.forEach(({ id, score }) => {
    const docId = id.split('-')[0];
    const doc = docStore.get(docId);
    const preview = doc?.text.slice(0, 80).replace(/\s+/g, ' ');
    console.log(`${id}\t${score.toFixed(4)}\t${preview || ''}`);
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: ts-node scripts/rag-query.ts <query>');
    process.exit(1);
  }
  const query = args.join(' ');
  await queryIndex(query);
}

if (require.main === module) {
  main();
}
