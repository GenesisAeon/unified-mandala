import { CodexNavigatorAgent } from '..';
import path from 'path';

describe('CodexNavigatorAgent', () => {
  const agent = new CodexNavigatorAgent({
    instructionsPath: path.join(__dirname, '../../../codexinstructions.yaml'),
    agentsPath: path.join(__dirname, '../../../AGENTS.md'),
  });

  it('parses instructions', () => {
    const lines = agent.parseInstructions();
    expect(lines.length).toBeGreaterThan(0);
  });

  it('parses agents', () => {
    const lines = agent.parseAgents();
    expect(lines.length).toBeGreaterThan(0);
  });
});
