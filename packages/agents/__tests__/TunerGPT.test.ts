import fs from 'fs';
import path from 'path';
import { describe, it, expect, afterEach } from 'vitest';
import { TunerGPT } from '../TunerGPT';

const OUTPUT = 'tmp-tuner-log.json';

describe('TunerGPT', () => {
  afterEach(() => {
    if (fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);
  });

  it('tunes value halfway toward target', async () => {
    const agent = new TunerGPT(OUTPUT);
    await agent.handle({ id: 't1', description: 'tune', value: 10, target: 14 } as any);
    const content = fs.readFileSync(path.resolve(OUTPUT), 'utf-8');
    const data = JSON.parse(content);
    expect(data[0].tuned).toBe(12);
  });
});
