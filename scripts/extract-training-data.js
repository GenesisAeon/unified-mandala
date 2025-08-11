#!/usr/bin/env node
/**
 * scripts/extract-training-data.js
 *
 * Extracts training data from docs/sigils/newadvancedconversations.json
 * and stores structured outputs in GenesisAeonZIPMEM/newadvancedconversations:
 *  - conversation.json & conversation.yaml
 *  - msg_0001.yaml ...
 *  - summary.md (placeholder)
 *  - meta.yaml
 *  - updates ZIPMEM_manifest.yaml
 *
 * Usage: node scripts/extract-training-data.js
 */

import fs from 'fs-extra';
import path from 'path';
import yaml from 'js-yaml';
import slugify from 'slugify';

// Paths
const SRC = path.resolve('docs/sigils/newadvancedconversations.json');
const OUT_ROOT = path.resolve('GenesisAeonZIPMEM/newadvancedconversations');
const MANIFEST = path.resolve('GenesisAeonZIPMEM/ZIPMEM_manifest.yaml');

async function extractTrainingData() {
  // 1. Load and parse JSON
  const raw = await fs.readFile(SRC, 'utf8');
  let convos;
  try {
    convos = JSON.parse(raw);
    if (!Array.isArray(convos)) throw new Error('Expected JSON array');
  } catch (e) {
    console.error('Fehler beim Lesen oder Parsen der Source JSON:', e);
    process.exit(1);
  }

  // 2. Load manifest
  let manifest = { conversations: [] };
  if (await fs.pathExists(MANIFEST)) {
    manifest = yaml.load(await fs.readFile(MANIFEST, 'utf8')) || manifest;
  }

  // 3. Process each conversation
  for (const convo of convos) {
    // Slug: date + text or id
    const date = convo.timestamp ? convo.timestamp.slice(0,10) : (convo.date || new Date().toISOString().slice(0,10));
    const title = convo.title || convo.id || 'conversation';
    const slug = `${date}-${slugify(title, {lower:true, strict:true})}`;
    const folder = path.join(OUT_ROOT, slug);
    await fs.ensureDir(folder);

    // 3a. Raw JSON & YAML
    await fs.writeFile(path.join(folder, 'conversation.json'), JSON.stringify(convo, null, 2));
    await fs.writeFile(path.join(folder, 'conversation.yaml'), yaml.dump(convo, { lineWidth: 120 }));

    // 3b. Fragments: msg_XXXX.yaml
    const messages = convo.messages || convo.log || [];
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      const idx = String(i+1).padStart(4,'0');
      const frag = {
        conversation: slug,
        index: i+1,
        role: msg.role || msg.sender || 'unknown',
        content: msg.content || msg.text || '',
        time: msg.timestamp || msg.time || null
      };
      await fs.writeFile(
        path.join(folder, `msg_${idx}.yaml`),
        yaml.dump(frag, { lineWidth: 120 })
      );
    }

    // 3c. Summary placeholder
    const summaryMd = `# Summary for ${slug}\n\n` +
      `*TODO: Generate conversation summary here.*\n`;
    await fs.writeFile(path.join(folder, 'summary.md'), summaryMd);

    // 3d. Meta
    const meta = {
      id: slug,
      title: title,
      date: date,
      participants: Array.from(new Set(messages.map(m => m.role || m.sender))).filter(Boolean),
      tags: convo.tags || []
    };
    await fs.writeFile(path.join(folder, 'meta.yaml'), yaml.dump(meta));

    // 3e. Manifest update
    if (!manifest.conversations.find(c => c.id === slug)) {
      manifest.conversations.push({
        id: slug,
        title: title,
        date: date,
        summary: '',
        tags: meta.tags
      });
    }
  }

  // 4. Write manifest back
  await fs.ensureDir(path.dirname(MANIFEST));
  await fs.writeFile(MANIFEST, yaml.dump(manifest, { lineWidth: 120 }));

  console.log('✅ Training data extraction complete.');
}

extractTrainingData().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
