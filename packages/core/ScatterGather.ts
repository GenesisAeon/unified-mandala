/**
 * ScatterGather - Fan-out/Fan-in pattern for parallel agent coordination
 *
 * Distributes tasks to multiple agents in parallel and aggregates results.
 * Handles partial failures gracefully and provides detailed execution metrics.
 *
 * Perfect for:
 * - Multi-agent consensus and voting
 * - Parallel data processing
 * - Distributed analysis with aggregation
 * - Redundant execution for reliability
 *
 * @example
 * ```typescript
 * const scatterGather = new ScatterGather({
 *   timeout: 5000,
 *   failFast: false,
 *   minSuccessful: 2
 * });
 *
 * const result = await scatterGather.execute(agents, task);
 * console.log(`${result.succeeded}/${agents.length} agents succeeded`);
 * ```
 */

import type { Agent, Task } from './interfaces';

export interface ScatterGatherConfig {
  /** Timeout for each agent execution in milliseconds (default: 10000) */
  timeout?: number;

  /** Fail immediately if any agent fails (default: false) */
  failFast?: boolean;

  /** Minimum number of successful executions required (default: 1) */
  minSuccessful?: number;

  /** Callback invoked when each agent completes */
  onAgentComplete?: (agentId: string, success: boolean, durationMs: number) => void;

  /** Callback invoked with partial results as they arrive */
  onPartialResult?: <T>(agentId: string, result: T) => void;
}

export interface AgentExecutionResult<T = any> {
  /** Agent identifier */
  agentId: string;

  /** Whether execution succeeded */
  success: boolean;

  /** Result data if successful */
  result?: T;

  /** Error if failed */
  error?: Error;

  /** Execution duration in milliseconds */
  durationMs: number;

  /** Whether execution timed out */
  timedOut: boolean;
}

export interface ScatterGatherResult<T = any> {
  /** All execution results (both success and failure) */
  results: AgentExecutionResult<T>[];

  /** Successful executions only */
  successful: AgentExecutionResult<T>[];

  /** Failed executions only */
  failed: AgentExecutionResult<T>[];

  /** Number of successful executions */
  succeeded: number;

  /** Number of failed executions */
  failedCount: number;

  /** Total execution time including parallel overhead (ms) */
  totalDurationMs: number;

  /** Whether minimum success threshold was met */
  meetsThreshold: boolean;
}

export class ScatterGather {
  private config: Required<ScatterGatherConfig>;

  constructor(config: ScatterGatherConfig = {}) {
    this.config = {
      timeout: config.timeout ?? 10000,
      failFast: config.failFast ?? false,
      minSuccessful: config.minSuccessful ?? 1,
      onAgentComplete: config.onAgentComplete ?? (() => {}),
      onPartialResult: config.onPartialResult ?? (() => {}),
    };
  }

  /**
   * Execute task across multiple agents in parallel
   */
  async execute<T = any>(
    agents: Agent[],
    task: Task,
  ): Promise<ScatterGatherResult<T>> {
    const startTime = Date.now();

    if (agents.length === 0) {
      return this.emptyResult(startTime);
    }

    // Execute all agents in parallel
    const executions = agents.map((agent) =>
      this.executeAgent<T>(agent, task),
    );

    // Wait for all to complete or fail fast
    const results = this.config.failFast
      ? await this.executeFailFast<T>(executions)
      : await Promise.all(executions);

    // Aggregate results
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);
    const totalDurationMs = Date.now() - startTime;
    const meetsThreshold = successful.length >= this.config.minSuccessful;

    return {
      results,
      successful,
      failed,
      succeeded: successful.length,
      failedCount: failed.length,
      totalDurationMs,
      meetsThreshold,
    };
  }

  /**
   * Execute task with a single agent with timeout and error handling
   */
  private async executeAgent<T>(
    agent: Agent,
    task: Task,
  ): Promise<AgentExecutionResult<T>> {
    const startTime = Date.now();
    let timedOut = false;

    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          timedOut = true;
          reject(new Error(`Agent ${agent.id} timed out after ${this.config.timeout}ms`));
        }, this.config.timeout);
      });

      // Race between agent execution and timeout
      const result = await Promise.race([
        this.wrapAgentExecution<T>(agent, task),
        timeoutPromise,
      ]);

      const durationMs = Date.now() - startTime;
      this.config.onAgentComplete(agent.id, true, durationMs);
      this.config.onPartialResult(agent.id, result);

      return {
        agentId: agent.id,
        success: true,
        result,
        durationMs,
        timedOut: false,
      };
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const err = error instanceof Error ? error : new Error(String(error));
      this.config.onAgentComplete(agent.id, false, durationMs);

      return {
        agentId: agent.id,
        success: false,
        error: err,
        durationMs,
        timedOut,
      };
    }
  }

  /**
   * Wrap agent execution to capture result
   */
  private async wrapAgentExecution<T>(
    agent: Agent,
    task: Task,
  ): Promise<T | undefined> {
    const result = await agent.handle(task);
    // Agents typically return void, but we allow capturing results
    return result as any;
  }

  /**
   * Execute with fail-fast behavior
   */
  private async executeFailFast<T>(
    executions: Promise<AgentExecutionResult<T>>[],
  ): Promise<AgentExecutionResult<T>[]> {
    const results: AgentExecutionResult<T>[] = [];

    for (const execution of executions) {
      const result = await execution;
      results.push(result);

      if (!result.success && this.config.failFast) {
        // Cancel remaining executions by returning early
        // Note: Already-started promises will continue running
        break;
      }
    }

    return results;
  }

  /**
   * Create empty result set
   */
  private emptyResult<T>(startTime: number): ScatterGatherResult<T> {
    return {
      results: [],
      successful: [],
      failed: [],
      succeeded: 0,
      failedCount: 0,
      totalDurationMs: Date.now() - startTime,
      meetsThreshold: false,
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<ScatterGatherConfig> {
    return { ...this.config };
  }
}

/**
 * Voting pattern - aggregates boolean results from multiple agents
 */
export class VotingScatterGather extends ScatterGather {
  /**
   * Execute agents and return majority vote
   */
  async vote(
    agents: Agent[],
    task: Task,
  ): Promise<{ decision: boolean; votes: { yes: number; no: number; failed: number } }> {
    const result = await this.execute<boolean>(agents, task);

    const votes = {
      yes: 0,
      no: 0,
      failed: result.failedCount,
    };

    for (const r of result.successful) {
      if (r.result === true) {
        votes.yes++;
      } else if (r.result === false) {
        votes.no++;
      }
    }

    return {
      decision: votes.yes > votes.no,
      votes,
    };
  }
}

/**
 * Aggregation patterns for common use cases
 */
export class AggregationPatterns {
  /**
   * First successful result (race pattern)
   */
  static firstSuccess<T>(result: ScatterGatherResult<T>): T | undefined {
    return result.successful[0]?.result;
  }

  /**
   * All successful results
   */
  static allSuccess<T>(result: ScatterGatherResult<T>): T[] {
    return result.successful.map((r) => r.result).filter((r): r is T => r !== undefined);
  }

  /**
   * Average of numeric results
   */
  static average(result: ScatterGatherResult<number>): number | undefined {
    const values = AggregationPatterns.allSuccess(result);
    if (values.length === 0) return undefined;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  /**
   * Median of numeric results
   */
  static median(result: ScatterGatherResult<number>): number | undefined {
    const values = AggregationPatterns.allSuccess(result).sort((a, b) => a - b);
    if (values.length === 0) return undefined;
    const mid = Math.floor(values.length / 2);
    return values.length % 2 === 0
      ? (values[mid - 1] + values[mid]) / 2
      : values[mid];
  }

  /**
   * Consensus - all agents must agree
   */
  static consensus<T>(result: ScatterGatherResult<T>): T | undefined {
    const values = AggregationPatterns.allSuccess(result);
    if (values.length === 0) return undefined;

    const first = JSON.stringify(values[0]);
    const allSame = values.every((v) => JSON.stringify(v) === first);

    return allSame ? values[0] : undefined;
  }

  /**
   * Majority - most common result
   */
  static majority<T>(result: ScatterGatherResult<T>): T | undefined {
    const values = AggregationPatterns.allSuccess(result);
    if (values.length === 0) return undefined;

    const counts = new Map<string, { value: T; count: number }>();

    for (const val of values) {
      const key = JSON.stringify(val);
      const entry = counts.get(key);
      if (entry) {
        entry.count++;
      } else {
        counts.set(key, { value: val, count: 1 });
      }
    }

    let maxCount = 0;
    let majorityValue: T | undefined;

    for (const { value, count } of counts.values()) {
      if (count > maxCount) {
        maxCount = count;
        majorityValue = value;
      }
    }

    return majorityValue;
  }
}

/**
 * Helper function for simple scatter-gather execution
 */
export async function scatterGather<T = any>(
  agents: Agent[],
  task: Task,
  config?: ScatterGatherConfig,
): Promise<ScatterGatherResult<T>> {
  const sg = new ScatterGather(config);
  return sg.execute<T>(agents, task);
}
