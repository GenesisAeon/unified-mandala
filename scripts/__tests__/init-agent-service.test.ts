import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { initAgentService } from '../init-agent-service';

describe('initAgentService', () => {
  it('creates service folder and index.ts', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-'));
    const dir = initAgentService('demo-agent', tmp);
    const file = path.join(dir, 'index.ts');
    expect(fs.existsSync(file)).toBe(true);
  });
});
