/**
 * SagaCoordinator - Distributed transaction pattern with compensation logic
 *
 * Implements the Saga pattern for long-running distributed workflows.
 * Each step has both a forward action and a compensation action for rollback.
 *
 * When a step fails, all previously completed steps are compensated in
 * reverse order, ensuring eventual consistency across distributed agents.
 *
 * Key features:
 * - Automatic rollback on failure
 * - State persistence for crash recovery
 * - Parallel step execution support
 * - Progress tracking and monitoring
 * - Integration with retry and timeout patterns
 *
 * @example
 * ```typescript
 * const saga = new SagaCoordinator({
 *   name: 'multi-agent-workflow',
 *   persistState: true
 * });
 *
 * saga.addStep({
 *   name: 'process-data',
 *   execute: async () => { await processData(); },
 *   compensate: async () => { await cleanupData(); }
 * });
 *
 * const result = await saga.execute();
 * if (!result.success) {
 *   console.log('Saga failed, all steps compensated');
 * }
 * ```
 */

import type { RetryPolicy } from './RetryPolicy';

export type SagaStepStatus =
  | 'pending'
  | 'executing'
  | 'completed'
  | 'compensating'
  | 'compensated'
  | 'failed';

export interface SagaStep {
  /** Step name for identification */
  name: string;

  /** Forward action to execute */
  execute: () => Promise<void>;

  /** Compensation action for rollback */
  compensate: () => Promise<void>;

  /** Optional retry policy for this step */
  retryPolicy?: RetryPolicy;

  /** Timeout in milliseconds (default: no timeout) */
  timeout?: number;

  /** Whether this step can run in parallel with others (default: false) */
  parallel?: boolean;

  /** Dependencies - step names that must complete first */
  dependsOn?: string[];

  /** Metadata for logging and debugging */
  metadata?: Record<string, unknown>;
}

export interface SagaStepExecution {
  /** Step configuration */
  step: SagaStep;

  /** Current status */
  status: SagaStepStatus;

  /** Start time of execution */
  executionStartTime?: Date;

  /** End time of execution */
  executionEndTime?: Date;

  /** Start time of compensation */
  compensationStartTime?: Date;

  /** End time of compensation */
  compensationEndTime?: Date;

  /** Error if execution failed */
  error?: Error;

  /** Execution attempt count */
  attempts: number;

  /** Result data if any */
  result?: unknown;
}

export interface SagaConfig {
  /** Saga name for identification */
  name: string;

  /** Persist saga state for recovery (default: false) */
  persistState?: boolean;

  /** Global timeout for entire saga in milliseconds */
  globalTimeout?: number;

  /** Continue compensation even if some compensations fail (default: true) */
  continueOnCompensationError?: boolean;

  /** Callback invoked when step completes */
  onStepComplete?: (step: string, durationMs: number) => void;

  /** Callback invoked when compensation starts */
  onCompensationStart?: (step: string) => void;

  /** Callback invoked when saga state changes */
  onStateChange?: (state: SagaState) => void;
}

export type SagaState =
  | 'initialized'
  | 'executing'
  | 'compensating'
  | 'completed'
  | 'failed'
  | 'compensated';

export interface SagaResult {
  /** Whether saga completed successfully */
  success: boolean;

  /** Current saga state */
  state: SagaState;

  /** Step executions */
  steps: SagaStepExecution[];

  /** Steps that completed successfully */
  completedSteps: string[];

  /** Steps that were compensated */
  compensatedSteps: string[];

  /** Failed step if any */
  failedStep?: string;

  /** Error that caused failure */
  error?: Error;

  /** Total execution duration in milliseconds */
  totalDurationMs: number;

  /** Whether any compensations failed */
  compensationErrors: boolean;
}

export class SagaCoordinator {
  private config: Required<SagaConfig>;
  private steps: SagaStep[] = [];
  private executions: Map<string, SagaStepExecution> = new Map();
  private compensationOrder: string[] = []; // Track actual compensation order
  private state: SagaState = 'initialized';
  private startTime?: Date;
  private endTime?: Date;

  constructor(config: SagaConfig) {
    this.config = {
      ...config,
      persistState: config.persistState ?? false,
      globalTimeout: config.globalTimeout ?? 0,
      continueOnCompensationError: config.continueOnCompensationError ?? true,
      onStepComplete: config.onStepComplete ?? (() => {}),
      onCompensationStart: config.onCompensationStart ?? (() => {}),
      onStateChange: config.onStateChange ?? (() => {}),
    };
  }

  /**
   * Add a step to the saga
   */
  addStep(step: SagaStep): this {
    this.steps.push(step);
    this.executions.set(step.name, {
      step,
      status: 'pending',
      attempts: 0,
    });
    return this;
  }

  /**
   * Add multiple steps to the saga
   */
  addSteps(steps: SagaStep[]): this {
    for (const step of steps) {
      this.addStep(step);
    }
    return this;
  }

  /**
   * Execute the saga
   */
  async execute(): Promise<SagaResult> {
    this.startTime = new Date();
    this.setState('executing');

    try {
      // Apply global timeout if configured
      if (this.config.globalTimeout > 0) {
        await this.executeWithTimeout();
      } else {
        await this.executeSteps();
      }

      this.setState('completed');
      this.endTime = new Date();

      return this.buildResult(true);
    } catch (error) {
      // Saga failed - compensate all completed steps
      await this.compensate();

      this.setState('failed');
      this.endTime = new Date();

      return this.buildResult(
        false,
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }

  /**
   * Execute steps with dependency resolution and parallelization
   */
  private async executeSteps(): Promise<void> {
    const executed = new Set<string>();
    const toExecute = [...this.steps];

    while (toExecute.length > 0) {
      // Find steps ready to execute (dependencies satisfied)
      const ready = toExecute.filter((step) => {
        if (!step.dependsOn || step.dependsOn.length === 0) {
          return true;
        }
        return step.dependsOn.every((dep) => executed.has(dep));
      });

      if (ready.length === 0 && toExecute.length > 0) {
        throw new Error(
          `Circular dependency detected or missing dependencies: ${toExecute.map((s) => s.name).join(', ')}`,
        );
      }

      // Separate parallel and sequential steps
      const parallelSteps = ready.filter((s) => s.parallel);
      const sequentialSteps = ready.filter((s) => !s.parallel);

      // Execute parallel steps concurrently
      if (parallelSteps.length > 0) {
        await Promise.all(
          parallelSteps.map((step) => this.executeStep(step)),
        );
        parallelSteps.forEach((s) => executed.add(s.name));
      }

      // Execute sequential steps one by one
      for (const step of sequentialSteps) {
        await this.executeStep(step);
        executed.add(step.name);
      }

      // Remove executed steps from queue
      ready.forEach((step) => {
        const index = toExecute.indexOf(step);
        if (index !== -1) {
          toExecute.splice(index, 1);
        }
      });
    }
  }

  /**
   * Execute a single step
   */
  private async executeStep(step: SagaStep): Promise<void> {
    const execution = this.executions.get(step.name)!;
    execution.status = 'executing';
    execution.executionStartTime = new Date();
    execution.attempts++;

    try {
      // Apply timeout if configured
      if (step.timeout && step.timeout > 0) {
        await this.withTimeout(step.execute(), step.timeout);
      } else {
        // Apply retry policy if configured
        if (step.retryPolicy) {
          await step.retryPolicy.execute(step.execute);
        } else {
          await step.execute();
        }
      }

      execution.status = 'completed';
      execution.executionEndTime = new Date();

      const durationMs =
        execution.executionEndTime.getTime() -
        execution.executionStartTime.getTime();

      this.config.onStepComplete(step.name, durationMs);

      if (this.config.persistState) {
        await this.persistSagaState();
      }
    } catch (error) {
      execution.status = 'failed';
      execution.error =
        error instanceof Error ? error : new Error(String(error));
      execution.executionEndTime = new Date();

      throw execution.error;
    }
  }

  /**
   * Compensate all completed steps in reverse order
   */
  private async compensate(): Promise<void> {
    this.setState('compensating');

    // Get all completed steps
    const completedSteps = this.steps.filter((step) => {
      const exec = this.executions.get(step.name);
      return exec && exec.status === 'completed';
    });

    // Compensate in reverse order
    for (let i = completedSteps.length - 1; i >= 0; i--) {
      await this.compensateStep(completedSteps[i]);
    }

    this.setState('compensated');
  }

  /**
   * Compensate a single step
   */
  private async compensateStep(step: SagaStep): Promise<void> {
    const execution = this.executions.get(step.name)!;
    execution.status = 'compensating';
    execution.compensationStartTime = new Date();

    this.config.onCompensationStart(step.name);

    try {
      await step.compensate();
      execution.status = 'compensated';
      this.compensationOrder.push(step.name); // Track compensation order
    } catch (error) {
      execution.status = 'failed';
      execution.error =
        error instanceof Error ? error : new Error(String(error));

      if (!this.config.continueOnCompensationError) {
        throw execution.error;
      }

      // Log but continue compensation
      console.error(
        `[Saga] Compensation failed for step "${step.name}":`,
        execution.error,
      );
    } finally {
      execution.compensationEndTime = new Date();
    }
  }

  /**
   * Execute with global timeout
   */
  private async executeWithTimeout(): Promise<void> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `Saga "${this.config.name}" timed out after ${this.config.globalTimeout}ms`,
          ),
        );
      }, this.config.globalTimeout);
    });

    await Promise.race([this.executeSteps(), timeoutPromise]);
  }

  /**
   * Wrap a promise with timeout
   */
  private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Step timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  /**
   * Update saga state
   */
  private setState(newState: SagaState): void {
    this.state = newState;
    this.config.onStateChange(newState);
  }

  /**
   * Build result object
   */
  private buildResult(success: boolean, error?: Error): SagaResult {
    const executions = Array.from(this.executions.values());
    // Include both 'completed' and 'compensated' since compensated steps were completed before compensation
    const completedSteps = executions
      .filter((e) => e.status === 'completed' || e.status === 'compensated')
      .map((e) => e.step.name);

    // Use actual compensation order instead of insertion order
    const compensatedSteps = this.compensationOrder;

    const failedExecution = executions.find((e) => e.status === 'failed');

    // Check for errors during compensation (status 'failed' with compensationStartTime)
    const compensationErrors = executions.some(
      (e) => e.status === 'failed' && e.compensationStartTime && e.error,
    );

    const totalDurationMs = this.endTime && this.startTime
      ? this.endTime.getTime() - this.startTime.getTime()
      : 0;

    return {
      success,
      state: this.state,
      steps: executions,
      completedSteps,
      compensatedSteps,
      failedStep: failedExecution?.step.name,
      error: error || failedExecution?.error,
      totalDurationMs,
      compensationErrors,
    };
  }

  /**
   * Persist saga state (placeholder for actual implementation)
   */
  private async persistSagaState(): Promise<void> {
    // In a real implementation, this would save to a database or event store
    // For now, this is a placeholder
    if (this.config.persistState) {
      // Could emit event for external persistence
      // eventBus.publish('saga.state.update', this.buildResult(true));
    }
  }

  /**
   * Get current saga state
   */
  getState(): SagaState {
    return this.state;
  }

  /**
   * Get step executions
   */
  getExecutions(): Map<string, SagaStepExecution> {
    return new Map(this.executions);
  }

  /**
   * Clear all steps (resets saga)
   */
  clear(): void {
    this.steps = [];
    this.executions.clear();
    this.compensationOrder = [];
    this.state = 'initialized';
    this.startTime = undefined;
    this.endTime = undefined;
  }
}

/**
 * Builder pattern for creating sagas
 */
export class SagaBuilder {
  private steps: SagaStep[] = [];
  private config: Partial<SagaConfig> = {};

  constructor(name: string) {
    this.config.name = name;
  }

  /**
   * Add a step to the saga
   */
  step(step: SagaStep): this {
    this.steps.push(step);
    return this;
  }

  /**
   * Configure global timeout
   */
  timeout(ms: number): this {
    this.config.globalTimeout = ms;
    return this;
  }

  /**
   * Enable state persistence
   */
  persist(): this {
    this.config.persistState = true;
    return this;
  }

  /**
   * Add step completion callback
   */
  onStepComplete(callback: (step: string, durationMs: number) => void): this {
    this.config.onStepComplete = callback;
    return this;
  }

  /**
   * Build the saga coordinator
   */
  build(): SagaCoordinator {
    const saga = new SagaCoordinator(this.config as SagaConfig);
    saga.addSteps(this.steps);
    return saga;
  }
}

/**
 * Helper function to create a saga
 */
export function createSaga(name: string): SagaBuilder {
  return new SagaBuilder(name);
}
