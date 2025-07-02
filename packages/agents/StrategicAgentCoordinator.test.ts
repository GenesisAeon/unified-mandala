import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { StrategicAgentCoordinator } from './StrategicAgentCoordinator';

test('synchronize writes agent list to file', () => {
  const tmp = fs.mkdtempSync('coord-test');
  fs.writeFileSync(path.join(tmp, 'AGENTS.md'), '# Test\n\n## \u2728 Agent: Demo\n');
  const coord = new StrategicAgentCoordinator(tmp);
  coord.synchronize();
  const out = path.join(tmp, 'strategy-overview.json');
  const data = JSON.parse(fs.readFileSync(out, 'utf-8'));
  expect(data.agents).toEqual(['Demo']);
  fs.rmSync(tmp, { recursive: true, force: true });
});
