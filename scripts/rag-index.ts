import fs from 'fs';
import path from 'path';
import { chunkText } from '../packages/rag/Chunker';
import { createEmbedder } from '../packages/rag/Embedder';
import { VectorStore } from '../packages/rag/VectorStore';
import { DocStore } from '../packages/rag/DocStore';

const STORE_DIR = process.env.RAG_STORE_DIR || path.join('data', 'rag');
const VECTOR_PATH = path.join(STORE_DIR, 'vectors.json');
const DOC_PATH = path.join(STORE_DIR, 'docs.json');

async function indexFile(file: string) {
  const text = fs.readFileSync(file, 'utf8');
  const docId = path.basename(file);
  const docStore = new DocStore(DOC_PATH);
  docStore.add({ id: docId, text, source: file });

  const chunks = chunkText(text, 200, 20);
  const embedder = createEmbedder();
  const vectorStore = new VectorStore(VECTOR_PATH);

  for (let i = 0; i < chunks.length; i++) {
    const vec = await embedder.embed(chunks[i].text);
    vectorStore.add(`${docId}-${i}`, vec);
  }
  console.log(`Indexed ${chunks.length} chunks from ${file}`);
}

async function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error('Usage: ts-node scripts/rag-index.ts <file ...>');
    process.exit(1);
  }
  for (const f of files) {
    await indexFile(f);
  }
}

if (require.main === module) {
  main();
}

