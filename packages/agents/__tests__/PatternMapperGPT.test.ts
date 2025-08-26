import fs from 'fs';
import path from 'path';
import { describe, it, expect, afterEach } from 'vitest';
import { PatternMapperGPT } from '../PatternMapperGPT';

const OUTPUT = 'tmp-pattern-map.json';

describe('PatternMapperGPT', () => {
  afterEach(() => {
    if (fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);
  });

  it('maps words from task descriptions', async () => {
    const agent = new PatternMapperGPT(OUTPUT);
    await agent.handle({ id: 'a1', description: 'Hello world hello' } as any);
    const content = fs.readFileSync(path.resolve(OUTPUT), 'utf-8');
    const data = JSON.parse(content);
    expect(data.hello).toEqual(['a1']);
    expect(data.world).toEqual(['a1']);
  });
});
