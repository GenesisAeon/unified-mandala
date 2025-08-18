import fs from 'fs';
import path from 'path';
import { chunkText } from '../packages/rag/Chunker';
import { createEmbedder } from '../packages/rag/Embedder';
import { VectorStore } from '../packages/rag/VectorStore';
import { DocStore } from '../packages/rag/DocStore';

const SIGIL_DIR = path.join('docs', 'sigils');
const STORE_DIR = process.env.RAG_STORE_DIR || path.join('data', 'rag');
const VECTOR_PATH = path.join(STORE_DIR, 'vectors.json');
const DOC_PATH = path.join(STORE_DIR, 'docs.json');

function collectFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...collectFiles(full));
    else if (/(\.ya?ml|\.json)$/i.test(e.name) && !e.name.includes('conversations'))
      files.push(full);
  }
  return files;
}

async function indexSigil(file: string) {
  const text = fs.readFileSync(file, 'utf8');
  const docId = path.relative(SIGIL_DIR, file);
  const docStore = new DocStore(DOC_PATH);
  fs.mkdirSync(STORE_DIR, { recursive: true });
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
  const files = collectFiles(SIGIL_DIR);
  for (const f of files) {
    await indexSigil(f);
  }
}

if (require.main === module) {
  main();
}
