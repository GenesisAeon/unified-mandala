import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { AeonAuraAgent } from './AeonAuraAgent';

const OUTPUT = 'tmp-aura.json';

describe('AeonAuraAgent', () => {
  afterEach(() => {
    if (fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);
  });

  it('writes aura log with color and tone', async () => {
    const agent = new AeonAuraAgent(OUTPUT);
    const task = { id: '1', description: 'Hello' } as any;
    await agent.handle(task);
    const content = fs.readFileSync(path.resolve(OUTPUT), 'utf-8');
    const data = JSON.parse(content);
    expect(data[0].description).toBe('Hello');
    expect(data[0].color).toMatch(/hsl\(/);
    expect(typeof data[0].tone).toBe('number');
  });
});
