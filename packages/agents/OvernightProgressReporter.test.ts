import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import { OvernightProgressReporter } from './OvernightProgressReporter';

const OUTPUT = 'tmp-overnight.log';

describe('OvernightProgressReporter', () => {
  afterEach(() => {
    if (fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);
  });

  it('records task summaries', async () => {
    const agent = new OvernightProgressReporter(OUTPUT);
    await agent.handle({ id: 't1', summary: 'done' } as any);
    const content = fs.readFileSync(OUTPUT, 'utf8');
    expect(content.trim()).toBe('t1:done');
  });
});
