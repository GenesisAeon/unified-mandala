import { describe, it, expect } from 'vitest';
import path from 'path';
import { promises as fs } from 'fs';
import { logTriggers } from './log_triggers';

describe('logTriggers', () => {
  it('writes trigger phrases and open todos to log file', async () => {
    const conversationsPath = path.join(__dirname, '../../tests/fixtures/sample-newadvancedconversations.json');
    const todoPath = path.join(__dirname, '../../tests/fixtures/sample-advancedToDo.yaml');
    const outPath = path.join(__dirname, 'tmp-migration-log.json');

    await fs.rm(outPath, { force: true });

    const result = await logTriggers({
      conversationsPath,
      todoPath,
      outPath,
      limit: 2,
    });

    const written = JSON.parse(await fs.readFile(outPath, 'utf8'));
    expect(written).toEqual(result);
    expect(result.triggerPhrases).toEqual(['Beta', 'Gamma']);
    expect(result.openTodos).toEqual(['pending task']);

    await fs.rm(outPath, { force: true });
  });
});
