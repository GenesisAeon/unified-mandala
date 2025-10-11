import { promises as fs, createReadStream } from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import StreamJson from 'stream-json';
import StreamArray from 'stream-json/streamers/StreamArray.js';

const { parser } = StreamJson;
const { streamArray } = StreamArray;

interface Reflection {
  record(message: string): void;
  summary(): { entries: number; lastEntry: string | null };
}

class BasicReflection implements Reflection {
  private logs: string[] = [];
  record(message: string) {
    this.logs.push(message);
  }
  summary() {
    return {
      entries: this.logs.length,
      lastEntry: this.logs[this.logs.length - 1] ?? null,
    };
  }
}

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function summarizeMessages(messages: any[]): string {
  const contents = messages
    .map((m: any) => (m.content || m.text || '').toString().trim())
    .filter(Boolean);
  if (contents.length === 0) return 'No summary available.';
  const summary = contents.slice(0, 2).join(' ').replace(/\s+/g, ' ');
  return summary.length > 200 ? summary.slice(0, 197) + '...' : summary;
}

export async function extractTrainingData(
  src = path.resolve('docs/sigils/newadvancedconversations.json'),
  outRoot = path.resolve('GenesisAeonZIPMEM/newadvancedconversations'),
  manifestPath = path.resolve('GenesisAeonZIPMEM/ZIPMEM_manifest.yaml'),
  reflection: Reflection = new BasicReflection(),
  crepThreshold = 0.5,
) {
  let manifest: any = { conversations: [] };
  try {
    const manifestRaw = await fs.readFile(manifestPath, 'utf8');
    manifest = (yaml.load(manifestRaw) as any) || manifest;
  } catch {
    // ignore if manifest doesn't exist
  }

  const pipeline = createReadStream(src, { encoding: 'utf8' }).pipe(parser()).pipe(streamArray());

  for await (const { value: convo } of pipeline) {
    const date = (convo.timestamp || convo.date || new Date().toISOString()).slice(0, 10);
    const title = convo.title || convo.id || 'conversation';
    const slug = `${date}-${slugifyTitle(title)}`;
    const folder = path.join(outRoot, slug);

    const rawMessages = convo.messages || convo.log || [];
    const messages = rawMessages.filter((m: any, i: number) => {
      const score =
        typeof m.crep === 'number'
          ? m.crep
          : typeof m.metadata?.crep === 'number'
            ? m.metadata.crep
            : typeof m.weight === 'number'
              ? m.weight
              : 1;
      if (score < crepThreshold) {
        reflection.record(`Filtered message ${i} in '${title}' with CREP ${score}`);
        return false;
      }
      return true;
    });

    if (messages.length === 0) {
      console.warn(`Skipping conversation '${title}' with no messages`);
      return;
    }

    await fs.mkdir(folder, { recursive: true });

    await fs.writeFile(path.join(folder, 'conversation.json'), JSON.stringify(convo, null, 2));
    await fs.writeFile(
      path.join(folder, 'conversation.yaml'),
      yaml.dump(convo, { lineWidth: 120 }),
    );

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const idx = String(i + 1).padStart(4, '0');
      const frag = {
        conversation: slug,
        index: i + 1,
        role: msg.role || msg.sender || 'unknown',
        content: msg.content || msg.text || '',
        time: msg.timestamp || msg.time || null,
      };
      await fs.writeFile(path.join(folder, `msg_${idx}.yaml`), yaml.dump(frag, { lineWidth: 120 }));
    }

    const summaryText = summarizeMessages(messages);
    const summaryMd = `# Summary for ${slug}\n\n${summaryText}\n`;
    await fs.writeFile(path.join(folder, 'summary.md'), summaryMd);

    const participants = Array.from(
      new Set(messages.map((m: any) => m.role || m.sender).filter(Boolean)),
    );
    const meta = { id: slug, title, date, participants, tags: convo.tags || [] };
    await fs.writeFile(path.join(folder, 'meta.yaml'), yaml.dump(meta));

    if (!manifest.conversations.find((c: any) => c.id === slug)) {
      manifest.conversations.push({
        id: slug,
        title,
        date,
        summary: summaryText,
        tags: meta.tags,
      });
    }
  }

  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, yaml.dump(manifest, { lineWidth: 120 }));

  console.log('✅ Training data extraction complete.');
}

// Allow execution as a standalone script in CommonJS environments
// while remaining importable in ESM contexts.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  extractTrainingData().catch((err) => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
}
