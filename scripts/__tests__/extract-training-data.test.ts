import { describe, it, expect } from 'vitest';
import { promises as fs, constants as fsConstants } from 'fs';
import path from 'path';
import os from 'os';
import yaml from 'js-yaml';
import { extractTrainingData } from '../extract-training-data';

async function exists(p: string) {
  try {
    await fs.access(p, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

describe('extractTrainingData', () => {
  it('writes conversation fragments and manifest', async () => {
    const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'extract-'));
    const src = path.join(tmp, 'source.json');
    const out = path.join(tmp, 'out');
    const manifest = path.join(tmp, 'manifest.yaml');

    const sample = [
      {
        timestamp: '2025-01-01T00:00:00Z',
        title: 'Test Conversation',
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi' },
        ],
      },
      {
        timestamp: '2025-01-02T00:00:00Z',
        title: 'Empty Conversation',
        messages: [],
      },
    ];
    await fs.writeFile(src, JSON.stringify(sample));

    await extractTrainingData(src, out, manifest);

    const slug = '2025-01-01-test-conversation';
    const emptySlug = '2025-01-02-empty-conversation';
    expect(await exists(path.join(out, slug, 'conversation.json'))).toBe(true);
    expect(await exists(path.join(out, slug, 'msg_0001.yaml'))).toBe(true);
    expect(await exists(path.join(out, emptySlug))).toBe(false);

    const manifestContent = yaml.load(await fs.readFile(manifest, 'utf8')) as any;
    expect(manifestContent.conversations).toHaveLength(1);
    expect(manifestContent.conversations[0].id).toBe(slug);
  });
});
