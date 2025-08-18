import fs from 'fs';
import path from 'path';
import { CitationIndex } from './CitationIndex';

describe('CitationIndex', () => {
  const tmpDir = path.join(__dirname, '__test__');
  const file = path.join(tmpDir, 'cites.json');

  beforeEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('stores citations and renders output', () => {
    const idx = new CitationIndex(file);
    idx.add({ id: 'c1', docId: 'doc1', chunk: 0, text: 'Hello World', source: 'file://doc1' });
    expect(idx.get('c1')?.docId).toBe('doc1');

    const md = idx.renderMarkdown(['c1']);
    expect(md).toContain('[1] Hello World');
    expect(md).toContain('file://doc1');

    const html = idx.renderHTML(['c1']);
    expect(html).toContain('<ol>');
    expect(html).toContain('<li>');
  });
});
