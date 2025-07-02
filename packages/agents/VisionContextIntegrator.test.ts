import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { VisionContextIntegrator } from './VisionContextIntegrator';

test('summarize provides short vision snippet', () => {
  const integrator = new VisionContextIntegrator('.');
  const result = integrator.summarize();
  expect(result.summary.length).toBeGreaterThan(0);
});
