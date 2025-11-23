import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SagaCoordinator, createSaga } from '../SagaCoordinator';
import type { SagaStep } from '../SagaCoordinator';

describe('SagaCoordinator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Execution', () => {
    it('should execute all steps successfully', async () => {
      const step1 = vi.fn().mockResolvedValue(undefined);
      const step2 = vi.fn().mockResolvedValue(undefined);
      const compensate1 = vi.fn().mockResolvedValue(undefined);
      const compensate2 = vi.fn().mockResolvedValue(undefined);

      const saga = new SagaCoordinator({ name: 'test-saga' });
      saga
        .addStep({
          name: 'step1',
          execute: step1,
          compensate: compensate1,
        })
        .addStep({
          name: 'step2',
          execute: step2,
          compensate: compensate2,
        });

      const result = await saga.execute();

      expect(result.success).toBe(true);
      expect(result.state).toBe('completed');
      expect(step1).toHaveBeenCalledTimes(1);
      expect(step2).toHaveBeenCalledTimes(1);
      expect(compensate1).not.toHaveBeenCalled();
      expect(compensate2).not.toHaveBeenCalled();
      expect(result.completedSteps).toEqual(['step1', 'step2']);
    });

    it('should execute steps in order', async () => {
      const executionOrder: string[] = [];

      const saga = new SagaCoordinator({ name: 'test-saga' });
      saga
        .addStep({
          name: 'step1',
          execute: async () => { executionOrder.push('step1'); },
          compensate: async () => {},
        })
        .addStep({
          name: 'step2',
          execute: async () => { executionOrder.push('step2'); },
          compensate: async () => {},
        })
        .addStep({
          name: 'step3',
          execute: async () => { executionOrder.push('step3'); },
          compensate: async () => {},
        });

      await saga.execute();

      expect(executionOrder).toEqual(['step1', 'step2', 'step3']);
    });
  });

  describe('Compensation on Failure', () => {
    it('should compensate in reverse order on failure', async () => {
      const compensationOrder: string[] = [];

      const saga = new SagaCoordinator({ name: 'test-saga' });
      saga
        .addStep({
          name: 'step1',
          execute: async (): Promise<void> => {},
          compensate: async () => { compensationOrder.push('step1'); },
        })
        .addStep({
          name: 'step2',
          execute: async (): Promise<void> => {},
          compensate: async () => { compensationOrder.push('step2'); },
        })
        .addStep({
          name: 'step3',
          execute: async (): Promise<void> => {
            throw new Error('Step 3 failed');
          },
          compensate: async () => { compensationOrder.push('step3'); },
        });

      const result = await saga.execute();

      expect(result.success).toBe(false);
      expect(result.state).toBe('failed');
      expect(compensationOrder).toEqual(['step2', 'step1']);
      expect(result.compensatedSteps).toEqual(['step2', 'step1']);
      expect(result.failedStep).toBe('step3');
    });

    it('should not compensate steps that never executed', async () => {
      const compensate1 = vi.fn().mockResolvedValue(undefined);
      const compensate2 = vi.fn().mockResolvedValue(undefined);
      const compensate3 = vi.fn().mockResolvedValue(undefined);

      const saga = new SagaCoordinator({ name: 'test-saga' });
      saga
        .addStep({
          name: 'step1',
          execute: async (): Promise<void> => {},
          compensate: compensate1,
        })
        .addStep({
          name: 'step2',
          execute: async (): Promise<void> => {
            throw new Error('Failed');
          },
          compensate: compensate2,
        })
        .addStep({
          name: 'step3',
          execute: async (): Promise<void> => {},
          compensate: compensate3,
        });

      await saga.execute();

      expect(compensate1).toHaveBeenCalledTimes(1);
      expect(compensate2).not.toHaveBeenCalled();
      expect(compensate3).not.toHaveBeenCalled();
    });
  });

  describe('Compensation Error Handling', () => {
    it('should continue compensation on error by default', async () => {
      const compensate1 = vi.fn().mockResolvedValue(undefined);
      const compensate2 = vi.fn().mockRejectedValue(new Error('Compensation failed'));

      const saga = new SagaCoordinator({ name: 'test-saga' });
      saga
        .addStep({
          name: 'step1',
          execute: async (): Promise<void> => {},
          compensate: compensate1,
        })
        .addStep({
          name: 'step2',
          execute: async (): Promise<void> => {},
          compensate: compensate2,
        })
        .addStep({
          name: 'step3',
          execute: async (): Promise<void> => {
            throw new Error('Failed');
          },
          compensate: async () => {},
        });

      const result = await saga.execute();

      expect(compensate2).toHaveBeenCalled();
      expect(compensate1).toHaveBeenCalled();
      expect(result.compensationErrors).toBe(true);
    });

    it('should stop compensation on error if configured', async () => {
      const compensate1 = vi.fn().mockResolvedValue(undefined);
      const compensate2 = vi.fn().mockRejectedValue(new Error('Compensation failed'));

      const saga = new SagaCoordinator({
        name: 'test-saga',
        continueOnCompensationError: false,
      });

      saga
        .addStep({
          name: 'step1',
          execute: async (): Promise<void> => {},
          compensate: compensate1,
        })
        .addStep({
          name: 'step2',
          execute: async (): Promise<void> => {},
          compensate: compensate2,
        })
        .addStep({
          name: 'step3',
          execute: async (): Promise<void> => {
            throw new Error('Failed');
          },
          compensate: async () => {},
        });

      await expect(saga.execute()).rejects.toThrow('Compensation failed');
      expect(compensate2).toHaveBeenCalled();
      expect(compensate1).not.toHaveBeenCalled();
    });
  });

  describe('Parallel Execution', () => {
    it('should execute parallel steps concurrently', async () => {
      const startTimes: Record<string, number> = {};
      const endTimes: Record<string, number> = {};

      const createDelayedStep = (name: string, delay: number): SagaStep => ({
        name,
        parallel: true,
        execute: async (): Promise<void> => {
          startTimes[name] = Date.now();
          await new Promise<void>((resolve) => setTimeout(resolve, delay));
          endTimes[name] = Date.now();
        },
        compensate: async () => {},
      });

      const saga = new SagaCoordinator({ name: 'test-saga' });
      saga
        .addStep(createDelayedStep('step1', 50))
        .addStep(createDelayedStep('step2', 50))
        .addStep(createDelayedStep('step3', 50));

      const startOverall = Date.now();
      await saga.execute();
      const endOverall = Date.now();

      // Parallel execution should take ~50ms, not 150ms
      expect(endOverall - startOverall).toBeLessThan(150);

      // All steps should start around the same time
      const times = Object.values(startTimes);
      const maxDiff = Math.max(...times) - Math.min(...times);
      expect(maxDiff).toBeLessThan(50);
    });

    it('should execute sequential steps in order', async () => {
      const executionOrder: string[] = [];

      const saga = new SagaCoordinator({ name: 'test-saga' });
      saga
        .addStep({
          name: 'step1',
          parallel: false,
          execute: async (): Promise<void> => {
            executionOrder.push('step1');
            await new Promise<void>((resolve) => setTimeout(resolve, 10));
          },
          compensate: async () => {},
        })
        .addStep({
          name: 'step2',
          parallel: false,
          execute: async () => { executionOrder.push('step2'); },
          compensate: async () => {},
        });

      await saga.execute();

      expect(executionOrder).toEqual(['step1', 'step2']);
    });
  });

  describe('Dependency Resolution', () => {
    it('should execute steps respecting dependencies', async () => {
      const executionOrder: string[] = [];

      const saga = new SagaCoordinator({ name: 'test-saga' });
      saga
        .addStep({
          name: 'step1',
          execute: async () => { executionOrder.push('step1'); },
          compensate: async () => {},
        })
        .addStep({
          name: 'step2',
          dependsOn: ['step1'],
          execute: async () => { executionOrder.push('step2'); },
          compensate: async () => {},
        })
        .addStep({
          name: 'step3',
          dependsOn: ['step1', 'step2'],
          execute: async () => { executionOrder.push('step3'); },
          compensate: async () => {},
        });

      await saga.execute();

      expect(executionOrder[0]).toBe('step1');
      expect(executionOrder[2]).toBe('step3');
    });

    it('should detect circular dependencies', async () => {
      const saga = new SagaCoordinator({ name: 'test-saga' });
      saga
        .addStep({
          name: 'step1',
          dependsOn: ['step2'],
          execute: async (): Promise<void> => {},
          compensate: async () => {},
        })
        .addStep({
          name: 'step2',
          dependsOn: ['step1'],
          execute: async (): Promise<void> => {},
          compensate: async () => {},
        });

      const result = await saga.execute();
      expect(result.success).toBe(false);
      expect(result.error?.message).toMatch(/Circular dependency/);
    });

    it('should detect missing dependencies', async () => {
      const saga = new SagaCoordinator({ name: 'test-saga' });
      saga.addStep({
        name: 'step1',
        dependsOn: ['nonexistent'],
        execute: async (): Promise<void> => {},
        compensate: async () => {},
      });

      const result = await saga.execute();
      expect(result.success).toBe(false);
      expect(result.error?.message).toMatch(/dependencies/);
    });
  });

  describe('Timeout Handling', () => {
    it('should timeout step execution', async () => {
      const saga = new SagaCoordinator({ name: 'test-saga' });
      saga.addStep({
        name: 'step1',
        timeout: 50,
        execute: async (): Promise<void> => {
          await new Promise<void>((resolve) => setTimeout(resolve, 200));
        },
        compensate: async () => {},
      });

      const result = await saga.execute();

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('timed out');
    });

    it('should respect global timeout', async () => {
      const saga = new SagaCoordinator({
        name: 'test-saga',
        globalTimeout: 100,
      });

      saga
        .addStep({
          name: 'step1',
          execute: async (): Promise<void> => {
            await new Promise<void>((resolve) => setTimeout(resolve, 50));
          },
          compensate: async () => {},
        })
        .addStep({
          name: 'step2',
          execute: async (): Promise<void> => {
            await new Promise<void>((resolve) => setTimeout(resolve, 100));
          },
          compensate: async () => {},
        });

      const result = await saga.execute();

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('timed out');
    });
  });

  describe('Callbacks', () => {
    it('should invoke onStepComplete callback', async () => {
      const onStepComplete = vi.fn();

      const saga = new SagaCoordinator({
        name: 'test-saga',
        onStepComplete,
      });

      saga.addStep({
        name: 'step1',
        execute: async (): Promise<void> => {},
        compensate: async () => {},
      });

      await saga.execute();

      expect(onStepComplete).toHaveBeenCalledWith('step1', expect.any(Number));
    });

    it('should invoke onCompensationStart callback', async () => {
      const onCompensationStart = vi.fn();

      const saga = new SagaCoordinator({
        name: 'test-saga',
        onCompensationStart,
      });

      saga
        .addStep({
          name: 'step1',
          execute: async (): Promise<void> => {},
          compensate: async () => {},
        })
        .addStep({
          name: 'step2',
          execute: async (): Promise<void> => {
            throw new Error('Failed');
          },
          compensate: async () => {},
        });

      await saga.execute();

      expect(onCompensationStart).toHaveBeenCalledWith('step1');
    });

    it('should invoke onStateChange callback', async () => {
      const onStateChange = vi.fn();

      const saga = new SagaCoordinator({
        name: 'test-saga',
        onStateChange,
      });

      saga.addStep({
        name: 'step1',
        execute: async (): Promise<void> => {},
        compensate: async () => {},
      });

      await saga.execute();

      expect(onStateChange).toHaveBeenCalledWith('executing');
      expect(onStateChange).toHaveBeenCalledWith('completed');
    });
  });

  describe('State Management', () => {
    it('should track saga state', async () => {
      const saga = new SagaCoordinator({ name: 'test-saga' });

      expect(saga.getState()).toBe('initialized');

      saga.addStep({
        name: 'step1',
        execute: async (): Promise<void> => {},
        compensate: async () => {},
      });

      const promise = saga.execute();
      await new Promise<void>((resolve) => setTimeout(resolve, 10));

      await promise;
      expect(saga.getState()).toBe('completed');
    });

    it('should track step executions', async () => {
      const saga = new SagaCoordinator({ name: 'test-saga' });

      saga.addStep({
        name: 'step1',
        execute: async (): Promise<void> => {},
        compensate: async () => {},
      });

      await saga.execute();

      const executions = saga.getExecutions();
      expect(executions.size).toBe(1);
      expect(executions.get('step1')?.status).toBe('completed');
      expect(executions.get('step1')?.attempts).toBe(1);
    });
  });

  describe('Builder Pattern', () => {
    it('should build saga using builder', async () => {
      const saga = createSaga('test-saga')
        .step({
          name: 'step1',
          execute: async (): Promise<void> => {},
          compensate: async () => {},
        })
        .step({
          name: 'step2',
          execute: async (): Promise<void> => {},
          compensate: async () => {},
        })
        .timeout(5000)
        .persist()
        .build();

      const result = await saga.execute();

      expect(result.success).toBe(true);
      expect(result.completedSteps).toEqual(['step1', 'step2']);
    });

    it('should configure callbacks via builder', async () => {
      const onStepComplete = vi.fn();

      const saga = createSaga('test-saga')
        .step({
          name: 'step1',
          execute: async (): Promise<void> => {},
          compensate: async () => {},
        })
        .onStepComplete(onStepComplete)
        .build();

      await saga.execute();

      expect(onStepComplete).toHaveBeenCalled();
    });
  });

  describe('Result Building', () => {
    it('should build comprehensive result', async () => {
      const saga = new SagaCoordinator({ name: 'test-saga' });

      saga
        .addStep({
          name: 'step1',
          execute: async (): Promise<void> => {},
          compensate: async () => {},
        })
        .addStep({
          name: 'step2',
          execute: async (): Promise<void> => {
            throw new Error('Test error');
          },
          compensate: async () => {},
        });

      const result = await saga.execute();

      expect(result).toMatchObject({
        success: false,
        state: 'failed',
        failedStep: 'step2',
        completedSteps: ['step1'],
        compensatedSteps: ['step1'],
      });

      expect(result.totalDurationMs).toBeGreaterThanOrEqual(0);
      expect(result.error?.message).toBe('Test error');
      expect(result.steps).toHaveLength(2);
    });
  });

  describe('Saga Lifecycle', () => {
    it('should clear saga state', async () => {
      const saga = new SagaCoordinator({ name: 'test-saga' });

      saga.addStep({
        name: 'step1',
        execute: async (): Promise<void> => {},
        compensate: async () => {},
      });

      await saga.execute();

      saga.clear();

      expect(saga.getState()).toBe('initialized');
      expect(saga.getExecutions().size).toBe(0);
    });

    it('should allow multiple executions after clear', async () => {
      const saga = new SagaCoordinator({ name: 'test-saga' });

      saga.addStep({
        name: 'step1',
        execute: async (): Promise<void> => {},
        compensate: async () => {},
      });

      await saga.execute();
      saga.clear();

      saga.addStep({
        name: 'step2',
        execute: async (): Promise<void> => {},
        compensate: async () => {},
      });

      const result = await saga.execute();

      expect(result.success).toBe(true);
      expect(result.completedSteps).toEqual(['step2']);
    });
  });

  describe('Multiple Steps', () => {
    it('should add multiple steps at once', async () => {
      const saga = new SagaCoordinator({ name: 'test-saga' });

      saga.addSteps([
        {
          name: 'step1',
          execute: async (): Promise<void> => {},
          compensate: async () => {},
        },
        {
          name: 'step2',
          execute: async (): Promise<void> => {},
          compensate: async () => {},
        },
      ]);

      const result = await saga.execute();

      expect(result.completedSteps).toEqual(['step1', 'step2']);
    });
  });
});
