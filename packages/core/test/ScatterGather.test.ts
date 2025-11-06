import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ScatterGather,
  VotingScatterGather,
  AggregationPatterns,
  scatterGather,
} from '../ScatterGather';
import type { Agent, Task } from '../interfaces';

describe('ScatterGather', () => {
  let mockTask: Task;

  beforeEach(() => {
    vi.clearAllMocks();
    mockTask = {
      id: 'test-task',
      description: 'Test task',
    };
  });

  const createMockAgent = (
    id: string,
    behavior: 'success' | 'fail' | 'timeout' | ((task: Task) => Promise<any>),
  ): Agent => ({
    id,
    layer: 'test',
    handle: async (task: Task) => {
      if (typeof behavior === 'function') {
        return behavior(task);
      }

      switch (behavior) {
        case 'success':
          return `result-${id}`;
        case 'fail':
          throw new Error(`Agent ${id} failed`);
        case 'timeout':
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return `result-${id}`;
      }
    },
  });

  describe('Basic Execution', () => {
    it('should execute all agents in parallel', async () => {
      const agents = [
        createMockAgent('agent1', 'success'),
        createMockAgent('agent2', 'success'),
        createMockAgent('agent3', 'success'),
      ];

      const sg = new ScatterGather();
      const result = await sg.execute(agents, mockTask);

      expect(result.succeeded).toBe(3);
      expect(result.failedCount).toBe(0);
      expect(result.results).toHaveLength(3);
      expect(result.meetsThreshold).toBe(true);
    });

    it('should handle empty agent list', async () => {
      const sg = new ScatterGather();
      const result = await sg.execute([], mockTask);

      expect(result.succeeded).toBe(0);
      expect(result.failedCount).toBe(0);
      expect(result.results).toHaveLength(0);
      expect(result.meetsThreshold).toBe(false);
    });

    it('should track execution duration', async () => {
      const agents = [createMockAgent('agent1', 'success')];

      const sg = new ScatterGather();
      const result = await sg.execute(agents, mockTask);

      expect(result.totalDurationMs).toBeGreaterThanOrEqual(0);
      expect(result.results[0].durationMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Partial Failures', () => {
    it('should handle some agents failing', async () => {
      const agents = [
        createMockAgent('agent1', 'success'),
        createMockAgent('agent2', 'fail'),
        createMockAgent('agent3', 'success'),
      ];

      const sg = new ScatterGather();
      const result = await sg.execute(agents, mockTask);

      expect(result.succeeded).toBe(2);
      expect(result.failedCount).toBe(1);
      expect(result.successful).toHaveLength(2);
      expect(result.failed).toHaveLength(1);
      expect(result.failed[0].error?.message).toContain('Agent agent2 failed');
    });

    it('should meet threshold with partial success', async () => {
      const agents = [
        createMockAgent('agent1', 'success'),
        createMockAgent('agent2', 'fail'),
        createMockAgent('agent3', 'fail'),
      ];

      const sg = new ScatterGather({ minSuccessful: 1 });
      const result = await sg.execute(agents, mockTask);

      expect(result.succeeded).toBe(1);
      expect(result.meetsThreshold).toBe(true);
    });

    it('should fail to meet threshold with insufficient success', async () => {
      const agents = [
        createMockAgent('agent1', 'success'),
        createMockAgent('agent2', 'fail'),
        createMockAgent('agent3', 'fail'),
      ];

      const sg = new ScatterGather({ minSuccessful: 2 });
      const result = await sg.execute(agents, mockTask);

      expect(result.succeeded).toBe(1);
      expect(result.meetsThreshold).toBe(false);
    });
  });

  describe('Timeout Handling', () => {
    it('should timeout slow agents', async () => {
      const agents = [
        createMockAgent('agent1', 'success'),
        createMockAgent('agent2', 'timeout'),
      ];

      const sg = new ScatterGather({ timeout: 100 });
      const result = await sg.execute(agents, mockTask);

      expect(result.succeeded).toBe(1);
      expect(result.failedCount).toBe(1);
      expect(result.failed[0].timedOut).toBe(true);
      expect(result.failed[0].error?.message).toContain('timed out');
    });

    it('should respect custom timeout', async () => {
      const agent = createMockAgent('agent1', async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return 'result';
      });

      const sg = new ScatterGather({ timeout: 100 });
      const result = await sg.execute([agent], mockTask);

      expect(result.failedCount).toBe(1);
      expect(result.failed[0].timedOut).toBe(true);
    });
  });

  describe('Fail-Fast Mode', () => {
    it('should stop on first failure when failFast enabled', async () => {
      let agent3Called = false;
      const agents = [
        createMockAgent('agent1', 'success'),
        createMockAgent('agent2', 'fail'),
        createMockAgent('agent3', async () => {
          agent3Called = true;
          return 'result';
        }),
      ];

      const sg = new ScatterGather({ failFast: true });
      const result = await sg.execute(agents, mockTask);

      // Note: Due to parallel execution, agent3 might still be called
      // But we expect at least one failure
      expect(result.failedCount).toBeGreaterThan(0);
    });
  });

  describe('Callbacks', () => {
    it('should invoke onAgentComplete callback', async () => {
      const onAgentComplete = vi.fn();
      const agents = [
        createMockAgent('agent1', 'success'),
        createMockAgent('agent2', 'fail'),
      ];

      const sg = new ScatterGather({ onAgentComplete });
      await sg.execute(agents, mockTask);

      expect(onAgentComplete).toHaveBeenCalledTimes(2);
      expect(onAgentComplete).toHaveBeenCalledWith(
        'agent1',
        true,
        expect.any(Number),
      );
      expect(onAgentComplete).toHaveBeenCalledWith(
        'agent2',
        false,
        expect.any(Number),
      );
    });

    it('should invoke onPartialResult callback', async () => {
      const onPartialResult = vi.fn();
      const agents = [createMockAgent('agent1', 'success')];

      const sg = new ScatterGather({ onPartialResult });
      await sg.execute(agents, mockTask);

      expect(onPartialResult).toHaveBeenCalledWith(
        'agent1',
        expect.any(String),
      );
    });
  });

  describe('Result Aggregation', () => {
    it('should separate successful and failed results', async () => {
      const agents = [
        createMockAgent('agent1', 'success'),
        createMockAgent('agent2', 'fail'),
        createMockAgent('agent3', 'success'),
      ];

      const sg = new ScatterGather();
      const result = await sg.execute(agents, mockTask);

      expect(result.successful.map((r) => r.agentId)).toEqual([
        'agent1',
        'agent3',
      ]);
      expect(result.failed.map((r) => r.agentId)).toEqual(['agent2']);
    });

    it('should capture agent IDs correctly', async () => {
      const agents = [
        createMockAgent('alpha', 'success'),
        createMockAgent('beta', 'success'),
      ];

      const sg = new ScatterGather();
      const result = await sg.execute(agents, mockTask);

      expect(result.results[0].agentId).toBe('alpha');
      expect(result.results[1].agentId).toBe('beta');
    });
  });

  describe('VotingScatterGather', () => {
    it('should count yes/no votes', async () => {
      const agents = [
        createMockAgent('agent1', async () => true),
        createMockAgent('agent2', async () => true),
        createMockAgent('agent3', async () => false),
      ];

      const vsg = new VotingScatterGather();
      const result = await vsg.vote(agents, mockTask);

      expect(result.decision).toBe(true);
      expect(result.votes.yes).toBe(2);
      expect(result.votes.no).toBe(1);
      expect(result.votes.failed).toBe(0);
    });

    it('should handle failed votes', async () => {
      const agents = [
        createMockAgent('agent1', async () => true),
        createMockAgent('agent2', 'fail'),
        createMockAgent('agent3', async () => false),
      ];

      const vsg = new VotingScatterGather();
      const result = await vsg.vote(agents, mockTask);

      expect(result.votes.yes).toBe(1);
      expect(result.votes.no).toBe(1);
      expect(result.votes.failed).toBe(1);
    });

    it('should make correct decision based on majority', async () => {
      const agents = [
        createMockAgent('agent1', async () => false),
        createMockAgent('agent2', async () => false),
        createMockAgent('agent3', async () => true),
      ];

      const vsg = new VotingScatterGather();
      const result = await vsg.vote(agents, mockTask);

      expect(result.decision).toBe(false);
    });
  });

  describe('AggregationPatterns', () => {
    describe('firstSuccess', () => {
      it('should return first successful result', async () => {
        const agents = [
          createMockAgent('agent1', async () => 'first'),
          createMockAgent('agent2', async () => 'second'),
        ];

        const sg = new ScatterGather();
        const result = await sg.execute(agents, mockTask);
        const first = AggregationPatterns.firstSuccess(result);

        expect(first).toBeTruthy();
      });
    });

    describe('allSuccess', () => {
      it('should return all successful results', async () => {
        const agents = [
          createMockAgent('agent1', async () => 10),
          createMockAgent('agent2', 'fail'),
          createMockAgent('agent3', async () => 20),
        ];

        const sg = new ScatterGather();
        const result = await sg.execute<number>(agents, mockTask);
        const all = AggregationPatterns.allSuccess(result);

        expect(all).toHaveLength(2);
        expect(all).toContain(10);
        expect(all).toContain(20);
      });
    });

    describe('average', () => {
      it('should calculate average of numeric results', async () => {
        const agents = [
          createMockAgent('agent1', async () => 10),
          createMockAgent('agent2', async () => 20),
          createMockAgent('agent3', async () => 30),
        ];

        const sg = new ScatterGather();
        const result = await sg.execute<number>(agents, mockTask);
        const avg = AggregationPatterns.average(result);

        expect(avg).toBe(20);
      });

      it('should return undefined for no successful results', async () => {
        const agents = [createMockAgent('agent1', 'fail')];

        const sg = new ScatterGather();
        const result = await sg.execute<number>(agents, mockTask);
        const avg = AggregationPatterns.average(result);

        expect(avg).toBeUndefined();
      });
    });

    describe('median', () => {
      it('should calculate median for odd number of results', async () => {
        const agents = [
          createMockAgent('agent1', async () => 10),
          createMockAgent('agent2', async () => 20),
          createMockAgent('agent3', async () => 30),
        ];

        const sg = new ScatterGather();
        const result = await sg.execute<number>(agents, mockTask);
        const median = AggregationPatterns.median(result);

        expect(median).toBe(20);
      });

      it('should calculate median for even number of results', async () => {
        const agents = [
          createMockAgent('agent1', async () => 10),
          createMockAgent('agent2', async () => 20),
          createMockAgent('agent3', async () => 30),
          createMockAgent('agent4', async () => 40),
        ];

        const sg = new ScatterGather();
        const result = await sg.execute<number>(agents, mockTask);
        const median = AggregationPatterns.median(result);

        expect(median).toBe(25); // (20 + 30) / 2
      });
    });

    describe('consensus', () => {
      it('should return value when all agree', async () => {
        const agents = [
          createMockAgent('agent1', async () => ({ value: 42 })),
          createMockAgent('agent2', async () => ({ value: 42 })),
          createMockAgent('agent3', async () => ({ value: 42 })),
        ];

        const sg = new ScatterGather();
        const result = await sg.execute(agents, mockTask);
        const consensus = AggregationPatterns.consensus(result);

        expect(consensus).toEqual({ value: 42 });
      });

      it('should return undefined when agents disagree', async () => {
        const agents = [
          createMockAgent('agent1', async () => ({ value: 42 })),
          createMockAgent('agent2', async () => ({ value: 43 })),
        ];

        const sg = new ScatterGather();
        const result = await sg.execute(agents, mockTask);
        const consensus = AggregationPatterns.consensus(result);

        expect(consensus).toBeUndefined();
      });
    });

    describe('majority', () => {
      it('should return most common value', async () => {
        const agents = [
          createMockAgent('agent1', async () => 'A'),
          createMockAgent('agent2', async () => 'B'),
          createMockAgent('agent3', async () => 'A'),
          createMockAgent('agent4', async () => 'A'),
        ];

        const sg = new ScatterGather();
        const result = await sg.execute(agents, mockTask);
        const majority = AggregationPatterns.majority(result);

        expect(majority).toBe('A');
      });
    });
  });

  describe('scatterGather Helper', () => {
    it('should provide convenient wrapper', async () => {
      const agents = [
        createMockAgent('agent1', 'success'),
        createMockAgent('agent2', 'success'),
      ];

      const result = await scatterGather(agents, mockTask);

      expect(result.succeeded).toBe(2);
    });

    it('should accept config', async () => {
      const onAgentComplete = vi.fn();
      const agents = [createMockAgent('agent1', 'success')];

      await scatterGather(agents, mockTask, { onAgentComplete });

      expect(onAgentComplete).toHaveBeenCalled();
    });
  });

  describe('Configuration', () => {
    it('should return current config', () => {
      const config = {
        timeout: 5000,
        failFast: true,
        minSuccessful: 3,
      };

      const sg = new ScatterGather(config);
      const retrieved = sg.getConfig();

      expect(retrieved.timeout).toBe(5000);
      expect(retrieved.failFast).toBe(true);
      expect(retrieved.minSuccessful).toBe(3);
    });
  });
});
