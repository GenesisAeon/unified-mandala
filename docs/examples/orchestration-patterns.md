# Agent Orchestration Patterns - Integration Examples

This guide demonstrates how to use the new orchestration patterns to build resilient, distributed agent systems.

## Table of Contents

1. [Retry Policy with Exponential Backoff](#retry-policy)
2. [Scatter-Gather for Parallel Coordination](#scatter-gather)
3. [Dead Letter Queue for Failed Messages](#dead-letter-queue)
4. [Saga Coordinator for Distributed Workflows](#saga-coordinator)
5. [Combining Patterns](#combining-patterns)

---

## Retry Policy

The Retry Policy provides configurable retry strategies with exponential backoff and jitter.

### Basic Usage

```typescript
import { RetryPolicy, withRetry } from '@core/RetryPolicy';

// Simple retry with defaults
const result = await withRetry(async () => {
  return await riskyAPICall();
});

// Custom retry policy
const policy = RetryPolicy.exponential({
  maxRetries: 5,
  initialBackoffMs: 100,
  maxBackoffMs: 10000,
  backoffMultiplier: 2,
  jitter: true,
});

const data = await policy.execute(async () => {
  return await fetchData();
});
```

### Advanced: Conditional Retries

```typescript
const policy = new RetryPolicy({
  maxRetries: 3,
  initialBackoffMs: 1000,
  maxBackoffMs: 5000,
  backoffMultiplier: 2,

  // Only retry network errors, not validation errors
  isRetryable: (error: Error) => {
    return error.message.includes('network') || error.message.includes('timeout');
  },

  // Log retry attempts
  onRetry: (attempt, error, nextBackoff) => {
    console.log(`Retry ${attempt} after ${nextBackoff}ms: ${error.message}`);
  },
});

await policy.execute(async () => {
  return await callExternalService();
});
```

### Decorator Pattern

```typescript
import { Retryable } from '@core/RetryPolicy';

class DataService {
  @Retryable({ maxRetries: 3, initialBackoffMs: 100 })
  async fetchUserData(userId: string) {
    // This method will automatically retry on failure
    return await api.get(`/users/${userId}`);
  }
}
```

---

## Scatter-Gather

Execute tasks across multiple agents in parallel and aggregate results.

### Basic Parallel Execution

```typescript
import { ScatterGather } from '@core/ScatterGather';
import type { Agent, Task } from '@core/interfaces';

const agents: Agent[] = [new AnalysisAgent(), new ValidationAgent(), new EnrichmentAgent()];

const task: Task = {
  id: 'task-123',
  description: 'Process document',
  crep: { C: 0.8, R: 0.7, E: 0.6, P: 0.9 },
};

const sg = new ScatterGather({
  timeout: 5000,
  minSuccessful: 2,
  onAgentComplete: (agentId, success, duration) => {
    console.log(`Agent ${agentId}: ${success ? 'OK' : 'FAIL'} (${duration}ms)`);
  },
});

const result = await sg.execute(agents, task);

console.log(`Success: ${result.succeeded}/${agents.length}`);
console.log(`Threshold met: ${result.meetsThreshold}`);
```

### Voting Pattern

```typescript
import { VotingScatterGather } from '@core/ScatterGather';

// Multi-agent consensus for decision making
const votingAgents: Agent[] = [new PolicyAgent(), new SafetyAgent(), new EthicsAgent()];

const vsg = new VotingScatterGather();
const vote = await vsg.vote(votingAgents, task);

console.log(`Decision: ${vote.decision ? 'APPROVED' : 'REJECTED'}`);
console.log(`Votes: ${vote.votes.yes} yes, ${vote.votes.no} no, ${vote.votes.failed} failed`);
```

### Aggregation Patterns

```typescript
import { ScatterGather, AggregationPatterns } from '@core/ScatterGather';

// Numeric aggregation
const scoringAgents: Agent[] = [
  new QualityScoreAgent(),
  new RelevanceScoreAgent(),
  new FreshnessScoreAgent(),
];

const sg = new ScatterGather();
const result = await sg.execute<number>(scoringAgents, task);

// Different aggregation strategies
const firstScore = AggregationPatterns.firstSuccess(result);
const avgScore = AggregationPatterns.average(result);
const medianScore = AggregationPatterns.median(result);

console.log(`Average score: ${avgScore}`);
console.log(`Median score: ${medianScore}`);

// Consensus - all agents must agree
const consensusResult = await sg.execute(agents, task);
const consensus = AggregationPatterns.consensus(consensusResult);

if (consensus) {
  console.log('All agents agree:', consensus);
} else {
  console.log('No consensus reached');
}

// Majority - most common result
const majority = AggregationPatterns.majority(result);
console.log('Majority result:', majority);
```

---

## Dead Letter Queue

Capture and manage failed messages for analysis and recovery.

### Basic DLQ Setup

```typescript
import { DeadLetterQueue } from '@event-bus/DeadLetterQueue';
import { LocalEventBus } from '@event-bus/LocalEventBus';

const eventBus = new LocalEventBus();
const dlq = new DeadLetterQueue(eventBus, {
  maxSize: 10000,
  retentionMs: 7 * 24 * 60 * 60 * 1000, // 7 days
  autoArchive: true,

  onMessage: (message) => {
    console.log(`Message sent to DLQ: ${message.id}`);
    // Alert monitoring system
  },

  onFull: (currentSize) => {
    console.warn(`DLQ is full (${currentSize} messages)`);
  },
});
```

### Sending Failed Messages to DLQ

```typescript
import { withDLQ } from '@event-bus/DeadLetterQueue';

// Automatic DLQ on failure
await withDLQ(
  dlq,
  'v1.agent.task',
  taskData,
  async () => {
    await processTask(taskData);
  },
  3, // max attempts
);

// Manual DLQ routing
try {
  await processMessage(message);
} catch (error) {
  await dlq.send({
    originalSubject: 'v1.crep.update',
    message,
    error: error as Error,
    attempts: 3,
    failureType: 'processing',
    metadata: {
      timestamp: Date.now(),
      agentId: 'agent-123',
    },
  });
}
```

### Analyzing and Replaying Messages

```typescript
// Get recent failures
const recentFailures = dlq.getMessages({
  limit: 10,
  after: new Date(Date.now() - 60 * 60 * 1000), // last hour
  failureType: 'timeout',
});

console.log(`Found ${recentFailures.length} timeout failures`);

// Get statistics
const stats = dlq.getStats();
console.log(`Total messages: ${stats.totalMessages}`);
console.log(`By type:`, stats.byFailureType);
console.log(`By subject:`, stats.bySubject);
console.log(`Average attempts: ${stats.averageAttempts}`);

// Replay failed messages
const toReplay = dlq.getMessages({
  failureType: 'timeout',
  includeReplayed: false,
  limit: 100,
});

const replayResult = await dlq.replayBatch({
  failureType: 'timeout',
  limit: 100,
});

console.log(`Replayed: ${replayResult.succeeded} succeeded, ${replayResult.failed} failed`);

// Clear old messages
const cleared = dlq.clear({
  before: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // older than 30 days
});

console.log(`Cleared ${cleared} old messages`);
```

---

## Saga Coordinator

Implement distributed transactions with automatic compensation on failure.

### Basic Saga

```typescript
import { SagaCoordinator, createSaga } from '@core/SagaCoordinator';

// Using builder pattern
const saga = createSaga('user-onboarding')
  .step({
    name: 'create-account',
    execute: async () => {
      const userId = await createUserAccount();
      console.log('Account created:', userId);
    },
    compensate: async () => {
      await deleteUserAccount();
      console.log('Account deleted (compensated)');
    },
  })
  .step({
    name: 'send-welcome-email',
    execute: async () => {
      await sendWelcomeEmail();
    },
    compensate: async () => {
      // Email already sent, log for audit
      console.log('Welcome email compensation (logged)');
    },
  })
  .step({
    name: 'setup-preferences',
    execute: async () => {
      await setupDefaultPreferences();
    },
    compensate: async () => {
      await clearPreferences();
    },
  })
  .timeout(30000)
  .onStepComplete((step, duration) => {
    console.log(`✓ ${step} completed in ${duration}ms`);
  })
  .build();

const result = await saga.execute();

if (result.success) {
  console.log('Onboarding completed successfully');
} else {
  console.log('Onboarding failed, all steps compensated');
  console.log('Failed at:', result.failedStep);
  console.log('Error:', result.error?.message);
}
```

### Saga with Dependencies

```typescript
const saga = new SagaCoordinator({ name: 'data-pipeline' });

saga
  .addStep({
    name: 'extract-data',
    execute: async () => {
      await extractData();
    },
    compensate: async () => {
      await cleanupExtractedData();
    },
  })
  .addStep({
    name: 'transform-data',
    dependsOn: ['extract-data'],
    execute: async () => {
      await transformData();
    },
    compensate: async () => {
      await cleanupTransformedData();
    },
  })
  .addStep({
    name: 'validate-data',
    dependsOn: ['transform-data'],
    execute: async () => {
      await validateData();
    },
    compensate: async () => {
      await clearValidationResults();
    },
  })
  .addStep({
    name: 'load-data',
    dependsOn: ['validate-data'],
    execute: async () => {
      await loadDataToWarehouse();
    },
    compensate: async () => {
      await rollbackDataLoad();
    },
  });

const result = await saga.execute();
```

### Parallel Steps in Saga

```typescript
const saga = new SagaCoordinator({ name: 'multi-channel-notify' });

saga
  .addStep({
    name: 'prepare-message',
    execute: async () => {
      await prepareNotification();
    },
    compensate: async () => {
      await clearNotification();
    },
  })
  .addSteps([
    // These run in parallel after 'prepare-message'
    {
      name: 'send-email',
      parallel: true,
      dependsOn: ['prepare-message'],
      execute: async () => await sendEmail(),
      compensate: async () => await logEmailCompensation(),
    },
    {
      name: 'send-sms',
      parallel: true,
      dependsOn: ['prepare-message'],
      execute: async () => await sendSMS(),
      compensate: async () => await logSMSCompensation(),
    },
    {
      name: 'send-push',
      parallel: true,
      dependsOn: ['prepare-message'],
      execute: async () => await sendPushNotification(),
      compensate: async () => await logPushCompensation(),
    },
  ]);

await saga.execute();
```

### Saga with Retry Policy

```typescript
import { RetryPolicy } from '@core/RetryPolicy';

const retryPolicy = RetryPolicy.exponential({
  maxRetries: 3,
  initialBackoffMs: 100,
});

const saga = new SagaCoordinator({ name: 'resilient-workflow' });

saga.addStep({
  name: 'call-external-api',
  retryPolicy, // This step will retry on failure
  timeout: 5000, // But timeout after 5 seconds per attempt
  execute: async () => {
    await callUnreliableAPI();
  },
  compensate: async () => {
    await cancelAPIOperation();
  },
});

await saga.execute();
```

---

## Combining Patterns

Here's how to combine all patterns for a production-grade distributed workflow.

### Example: Multi-Agent Data Processing Pipeline

```typescript
import { SagaCoordinator } from '@core/SagaCoordinator';
import { ScatterGather } from '@core/ScatterGather';
import { RetryPolicy } from '@core/RetryPolicy';
import { DeadLetterQueue } from '@event-bus/DeadLetterQueue';
import { LocalEventBus } from '@event-bus/LocalEventBus';

// Setup infrastructure
const eventBus = new LocalEventBus();
const dlq = new DeadLetterQueue(eventBus);
const retryPolicy = RetryPolicy.exponential({ maxRetries: 3 });

// Define agents
const processingAgents = [
  new DataCleaningAgent(),
  new DataEnrichmentAgent(),
  new DataValidationAgent(),
];

const analysisAgents = [
  new SentimentAnalysisAgent(),
  new EntityExtractionAgent(),
  new TopicModelingAgent(),
];

// Create saga
const saga = createSaga('data-processing-pipeline')
  .step({
    name: 'ingest-data',
    retryPolicy,
    execute: async () => {
      console.log('Ingesting data...');
      await ingestDataFromSource();
    },
    compensate: async () => {
      await cleanupIngestedData();
    },
  })
  .step({
    name: 'parallel-processing',
    dependsOn: ['ingest-data'],
    execute: async () => {
      console.log('Processing data with multiple agents...');

      const sg = new ScatterGather({
        timeout: 10000,
        minSuccessful: 2,
        onAgentComplete: (agentId, success, duration) => {
          console.log(`  ${agentId}: ${success ? '✓' : '✗'} (${duration}ms)`);
        },
      });

      const task = {
        id: 'process-task',
        description: 'Process ingested data',
      };

      const result = await sg.execute(processingAgents, task);

      if (!result.meetsThreshold) {
        throw new Error(
          `Insufficient successful agents: ${result.succeeded}/${processingAgents.length}`,
        );
      }

      console.log(`Processing complete: ${result.succeeded} agents succeeded`);
    },
    compensate: async () => {
      await rollbackProcessing();
    },
  })
  .step({
    name: 'parallel-analysis',
    dependsOn: ['parallel-processing'],
    parallel: true,
    execute: async () => {
      console.log('Analyzing processed data...');

      const sg = new ScatterGather({ timeout: 15000 });
      const task = {
        id: 'analysis-task',
        description: 'Analyze processed data',
      };

      const result = await sg.execute(analysisAgents, task);

      // Use aggregation to combine results
      const allResults = AggregationPatterns.allSuccess(result);
      console.log(`Analysis complete: ${allResults.length} results`);

      return allResults;
    },
    compensate: async () => {
      await clearAnalysisResults();
    },
  })
  .step({
    name: 'store-results',
    dependsOn: ['parallel-analysis'],
    retryPolicy,
    execute: async () => {
      console.log('Storing results...');
      await storeResults();
    },
    compensate: async () => {
      await deleteStoredResults();
    },
  })
  .timeout(60000)
  .onStepComplete((step, duration) => {
    console.log(`[SAGA] Step "${step}" completed in ${duration}ms`);
  })
  .build();

// Execute with DLQ support
try {
  const result = await saga.execute();

  if (result.success) {
    console.log('✓ Pipeline completed successfully');
    console.log(`  Total duration: ${result.totalDurationMs}ms`);
    console.log(`  Steps completed: ${result.completedSteps.join(', ')}`);
  } else {
    console.error('✗ Pipeline failed');
    console.error(`  Failed at step: ${result.failedStep}`);
    console.error(`  Error: ${result.error?.message}`);
    console.error(`  Compensated steps: ${result.compensatedSteps.join(', ')}`);

    // Send failure to DLQ for analysis
    await dlq.send({
      originalSubject: 'v1.pipeline.execute',
      message: { pipelineId: 'data-processing', timestamp: Date.now() },
      error: result.error!,
      attempts: 1,
      failureType: 'processing',
      metadata: {
        failedStep: result.failedStep,
        compensatedSteps: result.compensatedSteps,
      },
    });
  }
} catch (error) {
  console.error('Unexpected error:', error);

  await dlq.send({
    originalSubject: 'v1.pipeline.execute',
    message: { pipelineId: 'data-processing', timestamp: Date.now() },
    error: error as Error,
    attempts: 1,
    failureType: 'unknown',
  });
}
```

### Example: Resilient Agent Coordination

```typescript
import { AgentCoordinator } from '@agents/AgentCoordinator';
import { withRetry } from '@core/RetryPolicy';
import { DeadLetterQueue } from '@event-bus/DeadLetterQueue';

// Wrap agent coordinator with retry and DLQ
class ResilientAgentCoordinator extends AgentCoordinator {
  constructor(private dlq: DeadLetterQueue) {
    super();
  }

  async coordinate(symbolzeit: number, crep: number) {
    for (const agent of this.agents) {
      try {
        await withRetry(
          async () => {
            await agent.run(symbolzeit, crep);
          },
          {
            maxRetries: 2,
            initialBackoffMs: 500,
            onRetry: (attempt, error) => {
              console.log(`Retry ${attempt} for agent ${agent.id}: ${error.message}`);
            },
          },
        );
      } catch (error) {
        console.error(`Agent ${agent.id} failed after retries`);

        // Send to DLQ
        await this.dlq.send({
          originalSubject: 'v1.agent.coordinate',
          message: { agentId: agent.id, symbolzeit, crep },
          error: error as Error,
          attempts: 3,
          metadata: {
            agentId: agent.id,
            symbolzeit,
            crep,
          },
        });
      }
    }
  }
}
```

---

## Best Practices

### 1. Choose the Right Pattern

- **Retry Policy**: Single-operation resilience (API calls, database queries)
- **Scatter-Gather**: Parallel multi-agent coordination (consensus, aggregation)
- **Dead Letter Queue**: Message reliability and debugging
- **Saga**: Multi-step workflows with rollback requirements

### 2. Combine Patterns Wisely

```typescript
// Good: Saga with retry on each step
saga.addStep({
  name: 'api-call',
  retryPolicy: RetryPolicy.exponential(),
  execute: async () => await callAPI(),
  compensate: async () => await cancelAPICall(),
});

// Good: Scatter-gather with timeout
const sg = new ScatterGather({ timeout: 5000, minSuccessful: 2 });

// Avoid: Too many nested retries
// This could lead to exponentially long delays
```

### 3. Monitor and Alert

```typescript
const dlq = new DeadLetterQueue(eventBus, {
  onMessage: (message) => {
    // Alert if critical messages enter DLQ
    if (message.originalSubject.includes('critical')) {
      alertOps(`Critical message in DLQ: ${message.id}`);
    }
  },
  onFull: (size) => {
    // Alert if DLQ is filling up
    alertOps(`DLQ approaching capacity: ${size} messages`);
  },
});
```

### 4. Test Failure Scenarios

Always test your compensation logic:

```typescript
// Test saga compensation
const saga = createSaga('test-compensation').step({
  name: 'step1',
  execute: async () => {
    /* ... */
  },
  compensate: async () => {
    // Verify this actually cleans up
    expect(await checkCleanup()).toBe(true);
  },
});
```

---

## Performance Considerations

### Timeout Configuration

```typescript
// Too short: Premature timeouts
const bad = new ScatterGather({ timeout: 100 });

// Too long: Slow failure detection
const bad2 = new ScatterGather({ timeout: 60000 });

// Just right: Based on expected operation time + buffer
const good = new ScatterGather({ timeout: expectedDuration * 1.5 });
```

### Retry Backoff

```typescript
// Aggressive: Fast recovery but higher load
const aggressive = RetryPolicy.exponential({
  maxRetries: 5,
  initialBackoffMs: 50,
  backoffMultiplier: 1.5,
});

// Conservative: Lower load but slower recovery
const conservative = RetryPolicy.exponential({
  maxRetries: 3,
  initialBackoffMs: 1000,
  backoffMultiplier: 3,
});
```

### DLQ Size

```typescript
// Monitor DLQ size and adjust based on message volume
const dlq = new DeadLetterQueue(eventBus, {
  maxSize: messageVolumePerDay * 0.1, // 10% of daily volume
  retentionMs: 7 * 24 * 60 * 60 * 1000, // 7 days
  autoArchive: true,
});
```

---

## Conclusion

These orchestration patterns provide the building blocks for resilient, distributed agent systems. By combining retry logic, parallel execution, failure handling, and distributed transactions, you can build production-grade workflows that gracefully handle failures and maintain consistency.
