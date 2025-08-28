import { describe, it, expect } from 'vitest';
import { promises as fs, constants as fsConstants } from 'fs';
import path from 'path';
import os from 'os';
import yaml from 'js-yaml';
// ts-jest allows requiring TypeScript files directly; using `require` avoids
// issues with ESM syntax in the generated .js file.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { extractTrainingData } = require('../extract-training-data.ts');
import { SelfReflectionAgent } from '../../packages/self-reflection/src';

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
          { role: 'assistant', content: 'Ignore me', weight: 0.2 },
          { role: 'assistant', content: 'Hi', weight: 0.8 },
        ],
      },
      {
        timestamp: '2025-01-02T00:00:00Z',
        title: 'Empty Conversation',
        messages: [],
      },
    ];
    await fs.writeFile(src, JSON.stringify(sample));

    const reflection = new SelfReflectionAgent();
    await extractTrainingData(src, out, manifest, reflection, 0.5);

    const slug = '2025-01-01-test-conversation';
    const emptySlug = '2025-01-02-empty-conversation';
    expect(await exists(path.join(out, slug, 'conversation.json'))).toBe(true);
    expect(await exists(path.join(out, slug, 'msg_0001.yaml'))).toBe(true);
    expect(await exists(path.join(out, slug, 'msg_0002.yaml'))).toBe(true);
    expect(await exists(path.join(out, slug, 'msg_0003.yaml'))).toBe(false);
    expect(await exists(path.join(out, emptySlug))).toBe(false);

    const manifestContent = yaml.load(await fs.readFile(manifest, 'utf8')) as any;
    expect(manifestContent.conversations).toHaveLength(1);
    expect(manifestContent.conversations[0].id).toBe(slug);
    expect(manifestContent.conversations[0].summary).toContain('Hello');

    const summaryFile = await fs.readFile(path.join(out, slug, 'summary.md'), 'utf8');
    expect(summaryFile).toContain('Hello');
    expect(summaryFile).toContain('Hi');
    expect(summaryFile).not.toContain('Ignore me');

    expect(reflection.summary().entries).toBe(1);
  });
});
