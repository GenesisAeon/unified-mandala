import fs from 'fs';

export function extractChronoPoem(
  input = 'docs/sigils/conversations.json',
  output = 'CHRONOPOEM_TIMELINE.md',
) {
  const raw = fs.readFileSync(input, 'utf-8');
  const data = JSON.parse(raw);
  const lines = (Array.isArray(data) ? data : []).map((item: any) => {
    const time = item.timestamp || item.date || '';
    const title = item.title || item.text || '';
    return `- ${time}: ${title}`;
  });
  fs.writeFileSync(output, lines.join('\n'));
}

if (require.main === module) {
  extractChronoPoem(process.argv[2], process.argv[3]);
}
