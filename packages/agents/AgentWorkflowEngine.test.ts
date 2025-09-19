import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import AgentWorkflowEngine from './AgentWorkflowEngine';

describe('AgentWorkflowEngine', () => {
  let tempDir: string;
  let registryPath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-workflow-'));
    registryPath = path.join(tempDir, 'agents.yaml');
    fs.writeFileSync(
      registryPath,
      [
        'agents:',
        '  - id: alpha',
        '    start: script.ts',
        '  - id: beta',
        '    ethical_guardrails: false',
        '    start: script.ts',
      ].join('\n'),
      'utf8',
    );
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('defaults ethical_guardrails to true when missing', () => {
    const engine = new AgentWorkflowEngine(registryPath);
    engine.loadAgents();
    const snapshot = engine.snapshot();
    expect(snapshot).toHaveLength(2);
    const alpha = snapshot.find((entry) => entry.id === 'alpha');
    const beta = snapshot.find((entry) => entry.id === 'beta');
    expect(alpha?.ethical_guardrails).toBe(true);
    expect(beta?.ethical_guardrails).toBe(false);
  });
});
