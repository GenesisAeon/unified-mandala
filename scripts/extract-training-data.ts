import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function extractTrainingData(
  src = path.resolve('docs/sigils/newadvancedconversations.json'),
  outRoot = path.resolve('GenesisAeonZIPMEM/newadvancedconversations'),
  manifestPath = path.resolve('GenesisAeonZIPMEM/ZIPMEM_manifest.yaml')
) {
  let raw = '';
  try {
    raw = await fs.readFile(src, 'utf8');
  } catch (e) {
    console.error('Fehler beim Lesen oder Parsen der Source JSON:', e);
    process.exit(1);
  }
  let convos: any[] = [];
  try {
    convos = JSON.parse(raw);
    if (!Array.isArray(convos)) throw new Error('Expected JSON array');
  } catch (e) {
    console.error('Fehler beim Lesen oder Parsen der Source JSON:', e);
    process.exit(1);
  }

  let manifest: any = { conversations: [] };
  try {
    const manifestRaw = await fs.readFile(manifestPath, 'utf8');
    manifest = (yaml.load(manifestRaw) as any) || manifest;
  } catch {
    // ignore if manifest doesn't exist
  }

  for (const convo of convos) {
    const date = (convo.timestamp || convo.date || new Date().toISOString()).slice(0, 10);
    const title = convo.title || convo.id || 'conversation';
    const slug = `${date}-${slugifyTitle(title)}`;
    const folder = path.join(outRoot, slug);

    const messages = convo.messages || convo.log || [];
    if (messages.length === 0) {
      console.warn(`Skipping conversation '${title}' with no messages`);
      continue;
    }

    await fs.mkdir(folder, { recursive: true });

    await fs.writeFile(path.join(folder, 'conversation.json'), JSON.stringify(convo, null, 2));
    await fs.writeFile(path.join(folder, 'conversation.yaml'), yaml.dump(convo, { lineWidth: 120 }));

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
      await fs.writeFile(
        path.join(folder, `msg_${idx}.yaml`),
        yaml.dump(frag, { lineWidth: 120 })
      );
    }

    const summaryMd = `# Summary for ${slug}\n\n*TODO: Generate conversation summary here.*\n`;
    await fs.writeFile(path.join(folder, 'summary.md'), summaryMd);

    const participants = Array.from(
      new Set(messages.map((m: any) => m.role || m.sender).filter(Boolean))
    );
    const meta = { id: slug, title, date, participants, tags: convo.tags || [] };
    await fs.writeFile(path.join(folder, 'meta.yaml'), yaml.dump(meta));

    if (!manifest.conversations.find((c: any) => c.id === slug)) {
      manifest.conversations.push({
        id: slug,
        title,
        date,
        summary: '',
        tags: meta.tags,
      });
    }
  }

  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, yaml.dump(manifest, { lineWidth: 120 }));

  console.log('✅ Training data extraction complete.');
}

if (require.main === module) {
  extractTrainingData().catch((err) => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
}
