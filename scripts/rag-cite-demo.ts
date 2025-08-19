import path from 'path';
import { createEmbedder } from '../packages/rag/Embedder';
import { VectorStore } from '../packages/rag/VectorStore';
import { DocStore } from '../packages/rag/DocStore';
import { CitationIndex } from '../packages/rag/CitationIndex';

const STORE_DIR = process.env.RAG_STORE_DIR || path.join('data', 'rag');
const VECTOR_PATH = path.join(STORE_DIR, 'vectors.json');
const DOC_PATH = path.join(STORE_DIR, 'docs.json');
const CITE_PATH = path.join(STORE_DIR, 'citations.json');

async function queryWithCitations(question: string, k = 3) {
  const embedder = createEmbedder();
  const vectorStore = new VectorStore(VECTOR_PATH);
  const docStore = new DocStore(DOC_PATH);
  const citeIndex = new CitationIndex(CITE_PATH);

  const qVec = await embedder.embed(question);
  const results = vectorStore.search(qVec, k);

  const citeIds: string[] = [];
  results.forEach(({ id, score }) => {
    const doc = docStore.get(id);
    if (!doc) return;
    const [docId, chunkStr] = id.split('#');
    const chunk = Number(chunkStr || 0);
    citeIndex.add({
      id,
      docId,
      chunk,
      text: doc.text.slice(0, 80).replace(/\s+/g, ' '),
      source: doc.source,
    });
    citeIds.push(id);
    console.log(`${score.toFixed(4)}\t${doc.text.slice(0, 80).replace(/\s+/g, ' ')}`);
  });

  const markdown = citeIndex.renderMarkdown(citeIds);
  if (markdown) {
    console.log('\nCitations:\n' + markdown);
  }
}

async function main() {
  const query = process.argv.slice(2).join(' ');
  if (!query) {
    console.error('Usage: ts-node scripts/rag-cite-demo.ts <query>');
    process.exit(1);
  }
  await queryWithCitations(query);
}

if (require.main === module) {
  main();
}
