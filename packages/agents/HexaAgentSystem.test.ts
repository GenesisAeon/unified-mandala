import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { HexaAgentSystem } from './HexaAgentSystem';

test('processLogs aggregates agents', () => {
  const hexa = new HexaAgentSystem();
  const result = hexa.processLogs(['resonanz hier', 'noch was']);
  expect(result.profile.count).toBe(1);
  expect(result.analysis.resonanceCount).toBe(1);
});
