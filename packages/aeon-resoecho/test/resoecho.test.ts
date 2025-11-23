/**
 * Tests für ResoEcho - Das Gedächtnis des Mandalas
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ResoEcho } from '../src/index';
import type { CREP } from '@mandala/crep';

describe('ResoEcho', () => {
  let resoEcho: ResoEcho;

  beforeEach(() => {
    resoEcho = new ResoEcho();
  });

  describe('Memory (remember & recall)', () => {
    it('should remember a CREP measurement', () => {
      const crep: CREP = {
        coherence: 0.8,
        resonance: 0.7,
        emergence: 0.9,
        poetics: 0.6,
        crep: 0.75,
      };

      const echo = resoEcho.remember(crep, 'test-context');

      expect(echo).toBeDefined();
      expect(echo.id).toMatch(/^echo-/);
      expect(echo.crep).toEqual(crep);
      expect(echo.context).toBe('test-context');
      expect(echo.timestamp).toBeGreaterThan(0);
    });

    it('should recall all echoes', () => {
      const crep1: CREP = { coherence: 0.8, resonance: 0.7, emergence: 0.9, poetics: 0.6, crep: 0.75 };
      const crep2: CREP = { coherence: 0.6, resonance: 0.5, emergence: 0.7, poetics: 0.8, crep: 0.65 };

      resoEcho.remember(crep1, 'context-a');
      resoEcho.remember(crep2, 'context-b');

      const all = resoEcho.recall();
      expect(all).toHaveLength(2);
    });

    it('should recall echoes by context', () => {
      const crep: CREP = { coherence: 0.8, resonance: 0.7, emergence: 0.9, poetics: 0.6, crep: 0.75 };

      resoEcho.remember(crep, 'agent-interaction');
      resoEcho.remember(crep, 'data-pipeline');
      resoEcho.remember(crep, 'agent-interaction');

      const agentEchoes = resoEcho.recall('agent-interaction');
      expect(agentEchoes).toHaveLength(2);

      const pipelineEchoes = resoEcho.recall('data-pipeline');
      expect(pipelineEchoes).toHaveLength(1);
    });

    it('should limit stored echoes to maxEchoes', () => {
      const resoEchoSmall = new ResoEcho({ maxEchoes: 5 });
      const crep: CREP = { coherence: 0.8, resonance: 0.7, emergence: 0.9, poetics: 0.6, crep: 0.75 };

      for (let i = 0; i < 10; i++) {
        resoEchoSmall.remember(crep, 'test');
      }

      const echoes = resoEchoSmall.recall();
      expect(echoes).toHaveLength(5);
    });
  });

  describe('Time Window Recall', () => {
    it('should recall echoes in a time window', () => {
      const crep: CREP = { coherence: 0.8, resonance: 0.7, emergence: 0.9, poetics: 0.6, crep: 0.75 };

      const echo1 = resoEcho.remember(crep, 'test');
      const echo1Time = echo1.timestamp;

      // Create echo with explicitly different timestamp
      const echo2Time = echo1Time + 500;
      const echo2 = resoEcho.remember(crep, 'test');
      // Manually set timestamp for test purposes (in real use, time naturally passes)
      echo2.timestamp = echo2Time;

      // Query narrow window around echo1 only
      const echoes = resoEcho.recallTimeWindow(echo1Time - 100, echo1Time + 100);
      expect(echoes.length).toBeGreaterThanOrEqual(1);
      expect(echoes.some(e => e.id === echo1.id)).toBe(true);
    });
  });

  describe('Similarity Search', () => {
    it('should find similar CREP measurements', () => {
      const baseCrep: CREP = { coherence: 0.8, resonance: 0.7, emergence: 0.9, poetics: 0.6, crep: 0.75 };
      const similarCrep: CREP = { coherence: 0.81, resonance: 0.72, emergence: 0.88, poetics: 0.61, crep: 0.755 };
      const differentCrep: CREP = { coherence: 0.2, resonance: 0.1, emergence: 0.3, poetics: 0.15, crep: 0.19 };

      resoEcho.remember(baseCrep, 'test-1');
      resoEcho.remember(similarCrep, 'test-2');
      resoEcho.remember(differentCrep, 'test-3');

      const targetCrep: CREP = { coherence: 0.79, resonance: 0.71, emergence: 0.91, poetics: 0.59, crep: 0.75 };
      const similar = resoEcho.findSimilar(targetCrep, 5, 0.8);

      expect(similar.length).toBeGreaterThan(0);
      expect(similar.length).toBeLessThanOrEqual(2); // Should not include very different one
    });

    it('should return empty array if no similar echoes above threshold', () => {
      const crep: CREP = { coherence: 0.2, resonance: 0.1, emergence: 0.3, poetics: 0.15, crep: 0.19 };
      resoEcho.remember(crep, 'test');

      const targetCrep: CREP = { coherence: 0.9, resonance: 0.9, emergence: 0.9, poetics: 0.9, crep: 0.9 };
      const similar = resoEcho.findSimilar(targetCrep, 5, 0.95);

      expect(similar).toHaveLength(0);
    });
  });

  describe('Pattern Detection', () => {
    it('should detect high-emergence pattern', () => {
      const highEmergenceCrep: CREP = { coherence: 0.7, resonance: 0.7, emergence: 0.9, poetics: 0.7, crep: 0.75 };

      // Create multiple high-emergence echoes
      for (let i = 0; i < 5; i++) {
        resoEcho.remember(highEmergenceCrep, 'test');
      }

      const patterns = resoEcho.detectPatterns();
      const highEmergencePattern = patterns.find(p => p.type === 'high-emergence');

      expect(highEmergencePattern).toBeDefined();
      expect(highEmergencePattern!.confidence).toBeGreaterThan(0);
      expect(highEmergencePattern!.echoes.length).toBeGreaterThanOrEqual(3);
    });

    it('should detect stable-coherence pattern', () => {
      const stableCrep: CREP = { coherence: 0.75, resonance: 0.6, emergence: 0.5, poetics: 0.6, crep: 0.625 };

      // Create echoes with stable coherence
      for (let i = 0; i < 10; i++) {
        const slightVariation = 0.75 + (Math.random() - 0.5) * 0.02; // Very small variation
        resoEcho.remember(
          { ...stableCrep, coherence: slightVariation },
          'test'
        );
      }

      const patterns = resoEcho.detectPatterns();
      const stablePattern = patterns.find(p => p.type === 'stable-coherence');

      expect(stablePattern).toBeDefined();
    });

    it('should detect increasing-resonance pattern', () => {
      // Create echoes with increasing resonance
      for (let i = 0; i < 10; i++) {
        const resonance = 0.3 + (i * 0.07); // Increases from 0.3 to ~0.9
        resoEcho.remember(
          { coherence: 0.7, resonance, emergence: 0.6, poetics: 0.6, crep: 0.65 },
          'test'
        );
      }

      const patterns = resoEcho.detectPatterns();
      const risingPattern = patterns.find(p => p.type === 'increasing-resonance');

      expect(risingPattern).toBeDefined();
      expect(risingPattern!.confidence).toBeGreaterThan(0);
    });

    it('should detect declining-poetics pattern', () => {
      // Create echoes with declining poetics
      for (let i = 0; i < 10; i++) {
        const poetics = 0.9 - (i * 0.07); // Decreases from 0.9 to ~0.3
        resoEcho.remember(
          { coherence: 0.7, resonance: 0.6, emergence: 0.6, poetics, crep: 0.65 },
          'test'
        );
      }

      const patterns = resoEcho.detectPatterns();
      const decliningPattern = patterns.find(p => p.type === 'declining-poetics');

      expect(decliningPattern).toBeDefined();
      expect(decliningPattern!.confidence).toBeGreaterThan(0);
    });

    it('should return empty patterns for insufficient data', () => {
      const crep: CREP = { coherence: 0.7, resonance: 0.6, emergence: 0.5, poetics: 0.6, crep: 0.6 };
      resoEcho.remember(crep, 'test');
      resoEcho.remember(crep, 'test');

      const patterns = resoEcho.detectPatterns();
      expect(patterns).toHaveLength(0);
    });
  });

  describe('Feedback System', () => {
    it('should provide feedback with similar echoes and patterns', () => {
      const crep: CREP = { coherence: 0.8, resonance: 0.7, emergence: 0.9, poetics: 0.6, crep: 0.75 };

      // Add several echoes
      for (let i = 0; i < 10; i++) {
        resoEcho.remember(crep, 'test');
      }

      const feedback = resoEcho.getFeedback(crep, 'test');

      expect(feedback).toBeDefined();
      expect(feedback.recommendations).toBeDefined();
      expect(feedback.recommendations.length).toBeGreaterThan(0);
      expect(feedback.trends).toBeDefined();
      expect(feedback.patterns).toBeDefined();
      expect(feedback.similarEchoes).toBeDefined();
    });

    it('should include recommendations in feedback', () => {
      // Create pattern that triggers recommendations
      for (let i = 0; i < 10; i++) {
        const emergence = 0.9;
        resoEcho.remember(
          { coherence: 0.7, resonance: 0.6, emergence, poetics: 0.6, crep: 0.7 },
          'test'
        );
      }

      const currentCrep: CREP = { coherence: 0.7, resonance: 0.6, emergence: 0.9, poetics: 0.6, crep: 0.7 };
      const feedback = resoEcho.getFeedback(currentCrep, 'test');

      expect(feedback.recommendations.length).toBeGreaterThan(0);
      expect(feedback.recommendations.some(r => r.includes('Emergenz'))).toBe(true);
    });
  });

  describe('Trend Analysis', () => {
    it('should analyze trends correctly', () => {
      // Create rising trend in coherence
      for (let i = 0; i < 20; i++) {
        const coherence = 0.3 + (i * 0.03); // Rises from 0.3 to ~0.9
        resoEcho.remember(
          { coherence, resonance: 0.6, emergence: 0.6, poetics: 0.6, crep: 0.65 },
          'test'
        );
      }

      const currentCrep: CREP = { coherence: 0.9, resonance: 0.6, emergence: 0.6, poetics: 0.6, crep: 0.7 };
      const feedback = resoEcho.getFeedback(currentCrep, 'test');

      expect(feedback.trends.coherence).toBe('rising');
    });

    it('should detect stable trends', () => {
      const stableCrep: CREP = { coherence: 0.7, resonance: 0.7, emergence: 0.7, poetics: 0.7, crep: 0.7 };

      for (let i = 0; i < 20; i++) {
        resoEcho.remember(stableCrep, 'test');
      }

      const feedback = resoEcho.getFeedback(stableCrep, 'test');

      expect(feedback.trends.coherence).toBe('stable');
      expect(feedback.trends.resonance).toBe('stable');
    });
  });

  describe('Import & Export', () => {
    it('should export all echoes', () => {
      const crep: CREP = { coherence: 0.8, resonance: 0.7, emergence: 0.9, poetics: 0.6, crep: 0.75 };

      resoEcho.remember(crep, 'test-1');
      resoEcho.remember(crep, 'test-2');

      const exported = resoEcho.export();
      expect(exported).toHaveLength(2);
      expect(exported[0].crep).toEqual(crep);
    });

    it('should import echoes', () => {
      const crep: CREP = { coherence: 0.8, resonance: 0.7, emergence: 0.9, poetics: 0.6, crep: 0.75 };

      const echo1 = resoEcho.remember(crep, 'test-1');
      const echo2 = resoEcho.remember(crep, 'test-2');

      const exported = resoEcho.export();

      const newResoEcho = new ResoEcho();
      newResoEcho.import(exported);

      const imported = newResoEcho.recall();
      expect(imported).toHaveLength(2);
      expect(imported[0].id).toBe(echo1.id);
      expect(imported[1].id).toBe(echo2.id);
    });
  });

  describe('Statistics', () => {
    it('should return correct stats', () => {
      const crep1: CREP = { coherence: 0.8, resonance: 0.7, emergence: 0.9, poetics: 0.6, crep: 0.75 };
      const crep2: CREP = { coherence: 0.6, resonance: 0.5, emergence: 0.7, poetics: 0.8, crep: 0.65 };

      resoEcho.remember(crep1, 'context-a');
      resoEcho.remember(crep2, 'context-b');
      resoEcho.remember(crep1, 'context-a');

      const stats = resoEcho.stats();

      expect(stats.totalEchoes).toBe(3);
      expect(stats.contexts).toContain('context-a');
      expect(stats.contexts).toContain('context-b');
      expect(stats.contexts).toHaveLength(2);
      expect(stats.oldestTimestamp).toBeLessThanOrEqual(stats.newestTimestamp!);
      expect(stats.averageCREP).toBeDefined();
      expect(stats.averageCREP!.coherence).toBeCloseTo(0.733, 1);
    });

    it('should return empty stats for empty ResoEcho', () => {
      const stats = resoEcho.stats();

      expect(stats.totalEchoes).toBe(0);
      expect(stats.contexts).toHaveLength(0);
      expect(stats.oldestTimestamp).toBeNull();
      expect(stats.newestTimestamp).toBeNull();
      expect(stats.averageCREP).toBeNull();
    });
  });

  describe('Clear', () => {
    it('should clear all echoes', () => {
      const crep: CREP = { coherence: 0.8, resonance: 0.7, emergence: 0.9, poetics: 0.6, crep: 0.75 };

      resoEcho.remember(crep, 'test');
      resoEcho.remember(crep, 'test');

      expect(resoEcho.recall()).toHaveLength(2);

      resoEcho.clear();

      expect(resoEcho.recall()).toHaveLength(0);
    });
  });
});
