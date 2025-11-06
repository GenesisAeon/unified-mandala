# Agent Orchestration Patterns

## Overview

This document describes the orchestration patterns implemented in the unified-mandala system. These patterns enable resilient, distributed agent coordination with automatic failure handling, parallel execution, and workflow compensation.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Agent Orchestration Layer                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ RetryPolicy  │  │ScatterGather │  │    Saga      │      │
│  │              │  │              │  │ Coordinator  │      │
│  │ - Exponential│  │ - Fan-out    │  │              │      │
│  │   backoff    │  │ - Fan-in     │  │ - Forward    │      │
│  │ - Jitter     │  │ - Voting     │  │   execution  │      │
│  │ - Predicates │  │ - Aggregation│  │ - Compensation│     │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│                   ┌────────▼─────────┐                      │
│                   │   Event Bus      │                      │
│                   │  (NATS/Local)    │                      │
│                   └────────┬─────────┘                      │
│                            │                                 │
│                   ┌────────▼─────────┐                      │
│                   │ Dead Letter      │                      │
│                   │ Queue            │                      │
│                   │                  │                      │
│                   │ - Failed msgs    │                      │
│                   │ - Replay         │                      │
│                   │ - Analytics      │                      │
│                   └──────────────────┘                      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Patterns

### 1. Retry Policy

**Purpose**: Provide resilient execution for transient failures.

**When to use**:

- API calls that may fail temporarily
- Database operations with connection issues
- Any operation with potential network failures

**Key Features**:

- Exponential, linear, or immediate backoff strategies
- Configurable jitter to prevent thundering herd
- Conditional retry based on error type
- Callback hooks for monitoring

**Location**: `/packages/core/RetryPolicy.ts`

**Example**:

```typescript
const policy = RetryPolicy.exponential({
  maxRetries: 3,
  initialBackoffMs: 100,
  maxBackoffMs: 5000,
  backoffMultiplier: 2,
  jitter: true,
});

const result = await policy.execute(async () => {
  return await callAPI();
});
```

### 2. Scatter-Gather

**Purpose**: Execute tasks across multiple agents in parallel and aggregate results.

**When to use**:

- Multi-agent consensus and voting
- Parallel data processing
- Redundant execution for reliability
- Result aggregation from multiple sources

**Key Features**:

- Parallel execution with configurable timeout
- Partial failure handling
- Multiple aggregation strategies (average, median, consensus, majority)
- Voting pattern for decision making
- Minimum success threshold

**Location**: `/packages/core/ScatterGather.ts`

**Example**:

```typescript
const sg = new ScatterGather({
  timeout: 5000,
  minSuccessful: 2,
});

const result = await sg.execute(agents, task);

// Use aggregation patterns
const average = AggregationPatterns.average(result);
const consensus = AggregationPatterns.consensus(result);
```

### 3. Dead Letter Queue

**Purpose**: Capture and manage messages that failed processing for analysis and recovery.

**When to use**:

- Critical message processing
- Debugging systematic failures
- Audit trail for failed operations
- Message replay requirements

**Key Features**:

- Automatic routing after max retries
- Categorization by failure type (validation, timeout, processing)
- Message replay capabilities
- Statistics and analytics
- Configurable retention and archival

**Location**: `/packages/event-bus/DeadLetterQueue.ts`

**Example**:

```typescript
const dlq = new DeadLetterQueue(eventBus, {
  maxSize: 10000,
  retentionMs: 7 * 24 * 60 * 60 * 1000, // 7 days
  autoArchive: true,
});

// Failed message automatically routed
await dlq.send({
  originalSubject: 'v1.agent.task',
  message: failedTask,
  error: error,
  attempts: 3,
  failureType: 'timeout',
});

// Later, replay failed messages
await dlq.replay(messageId);
```

### 4. Saga Coordinator

**Purpose**: Implement distributed transactions with automatic compensation on failure.

**When to use**:

- Multi-step workflows requiring consistency
- Operations that need rollback capability
- Distributed transactions across services
- Long-running workflows with failure recovery

**Key Features**:

- Automatic compensation in reverse order
- Dependency resolution between steps
- Parallel step execution support
- Timeout handling (per-step and global)
- State persistence for crash recovery
- Integration with retry policies

**Location**: `/packages/core/SagaCoordinator.ts`

**Example**:

```typescript
const saga = createSaga('user-onboarding')
  .step({
    name: 'create-account',
    execute: async () => await createAccount(),
    compensate: async () => await deleteAccount(),
  })
  .step({
    name: 'send-email',
    dependsOn: ['create-account'],
    execute: async () => await sendWelcomeEmail(),
    compensate: async () => await logEmailSent(),
  })
  .timeout(30000)
  .build();

const result = await saga.execute();
```

## Pattern Composition

These patterns are designed to work together for building production-grade systems:

### Example: Resilient Multi-Agent Pipeline

```typescript
// 1. Retry policy for individual operations
const retryPolicy = RetryPolicy.exponential({ maxRetries: 3 });

// 2. Scatter-gather for parallel agent execution
const sg = new ScatterGather({ timeout: 5000, minSuccessful: 2 });

// 3. Saga for workflow coordination
const saga = createSaga('pipeline')
  .step({
    name: 'ingest',
    retryPolicy, // Individual step has retry
    execute: async () => await ingestData(),
    compensate: async () => await cleanupData(),
  })
  .step({
    name: 'process',
    dependsOn: ['ingest'],
    execute: async () => {
      // Use scatter-gather within saga step
      const result = await sg.execute(processingAgents, task);
      if (!result.meetsThreshold) {
        throw new Error('Insufficient successful agents');
      }
    },
    compensate: async () => await rollbackProcessing(),
  })
  .build();

// 4. DLQ for failure handling
try {
  const result = await saga.execute();
} catch (error) {
  await dlq.send({
    originalSubject: 'v1.pipeline.execute',
    message: { pipelineId: 'data-pipeline' },
    error: error as Error,
    attempts: 1,
  });
}
```

## Integration with Existing Systems

### Agent Coordinator Integration

```typescript
import { AgentCoordinator } from '@agents/AgentCoordinator';
import { withRetry } from '@core/RetryPolicy';

class ResilientAgentCoordinator extends AgentCoordinator {
  async coordinate(symbolzeit: number, crep: number) {
    for (const agent of this.agents) {
      await withRetry(
        async () => {
          if (this.meetsCrep(agent, crep) && this.meetsSymbolzeit(agent, symbolzeit)) {
            await agent.run(symbolzeit, crep);
          }
        },
        { maxRetries: 2 },
      );
    }
  }
}
```

### Event Bus Integration

```typescript
import { JetStreamBus } from '@event-bus/JetStreamBus';
import { DeadLetterQueue } from '@event-bus/DeadLetterQueue';
import { Subjects } from '@event-bus/subjects';

const jetStream = new JetStreamBus(/* ... */);
const dlq = new DeadLetterQueue(jetStream);

// Subscribe with DLQ support
jetStream.subscribe(Subjects.AGENT_HEARTBEAT, async (data) => {
  try {
    await processHeartbeat(data);
  } catch (error) {
    await dlq.send({
      originalSubject: Subjects.AGENT_HEARTBEAT,
      message: data,
      error: error as Error,
      attempts: 1,
      failureType: 'processing',
    });
  }
});
```

## Testing

All patterns include comprehensive test suites:

- **RetryPolicy**: `/packages/core/__tests__/RetryPolicy.test.ts`
- **ScatterGather**: `/packages/core/__tests__/ScatterGather.test.ts`
- **SagaCoordinator**: `/packages/core/__tests__/SagaCoordinator.test.ts`

Run tests:

```bash
pnpm test:unit packages/core
pnpm test:unit packages/event-bus
```

## Performance Considerations

### Retry Backoff Tuning

```typescript
// For high-traffic scenarios
const aggressive = RetryPolicy.exponential({
  maxRetries: 2,
  initialBackoffMs: 50,
  backoffMultiplier: 1.5,
});

// For low-traffic, critical operations
const conservative = RetryPolicy.exponential({
  maxRetries: 5,
  initialBackoffMs: 1000,
  backoffMultiplier: 3,
});
```

### Scatter-Gather Timeout

Set timeout based on expected operation time:

```typescript
const sg = new ScatterGather({
  timeout: expectedDuration * 1.5, // 50% buffer
  minSuccessful: Math.ceil(agents.length * 0.66), // 2/3 quorum
});
```

### DLQ Size

Monitor and adjust based on message volume:

```typescript
const dlq = new DeadLetterQueue(eventBus, {
  maxSize: dailyMessageVolume * 0.1, // 10% of daily volume
  retentionMs: 7 * 24 * 60 * 60 * 1000,
  autoArchive: true,
  onFull: (size) => {
    alertOps(`DLQ capacity warning: ${size} messages`);
  },
});
```

## Monitoring

### Metrics to Track

1. **Retry Policy**:
   - Retry success rate
   - Average retry attempts
   - Backoff duration distribution

2. **Scatter-Gather**:
   - Agent success rate
   - Parallel execution duration
   - Threshold achievement rate

3. **Dead Letter Queue**:
   - Messages per hour
   - Failure type distribution
   - Replay success rate
   - Queue size trends

4. **Saga Coordinator**:
   - Saga success rate
   - Compensation frequency
   - Step failure distribution
   - Average saga duration

### Instrumentation

```typescript
// Retry Policy
const policy = new RetryPolicy({
  maxRetries: 3,
  initialBackoffMs: 100,
  maxBackoffMs: 5000,
  backoffMultiplier: 2,
  onRetry: (attempt, error, backoff) => {
    metrics.increment('retry.attempt', {
      attempt: attempt.toString(),
      error_type: error.constructor.name,
    });
    metrics.histogram('retry.backoff_ms', backoff);
  },
});

// Scatter-Gather
const sg = new ScatterGather({
  onAgentComplete: (agentId, success, duration) => {
    metrics.increment('scatter_gather.agent_complete', {
      agent_id: agentId,
      success: success.toString(),
    });
    metrics.histogram('scatter_gather.agent_duration_ms', duration);
  },
});

// DLQ
const dlq = new DeadLetterQueue(eventBus, {
  onMessage: (message) => {
    metrics.increment('dlq.message', {
      failure_type: message.failureType,
      subject: message.originalSubject,
    });
  },
});

// Saga
const saga = createSaga('workflow')
  .onStepComplete((step, duration) => {
    metrics.increment('saga.step_complete', { step });
    metrics.histogram('saga.step_duration_ms', duration);
  })
  .build();
```

## Migration Guide

### Existing Code

```typescript
// Before: No retry
const data = await callAPI();

// After: With retry
const data = await withRetry(async () => await callAPI());
```

```typescript
// Before: Sequential agent execution
for (const agent of agents) {
  await agent.handle(task);
}

// After: Parallel with scatter-gather
const sg = new ScatterGather();
const result = await sg.execute(agents, task);
```

```typescript
// Before: Manual workflow
await step1();
await step2();
await step3();

// After: Saga with compensation
const saga = createSaga('workflow')
  .step({
    name: 'step1',
    execute: step1,
    compensate: undoStep1,
  })
  .step({
    name: 'step2',
    execute: step2,
    compensate: undoStep2,
  })
  .step({
    name: 'step3',
    execute: step3,
    compensate: undoStep3,
  })
  .build();

await saga.execute();
```

## Best Practices

1. **Always use jitter for retry policies** to prevent thundering herd
2. **Set reasonable timeouts** for scatter-gather based on operation characteristics
3. **Monitor DLQ size** and alert when approaching capacity
4. **Test compensation logic** thoroughly in saga workflows
5. **Use minimum success threshold** in scatter-gather for fault tolerance
6. **Combine patterns** for production-grade resilience
7. **Instrument with metrics** for observability
8. **Document failure scenarios** and test them

## Future Enhancements

Planned improvements:

1. **Circuit Breaker Integration**: Automatic circuit breaking based on failure rates
2. **Rate Limiting**: Per-agent rate limiting in scatter-gather
3. **Bulkhead Pattern**: Resource isolation between agent groups
4. **Event Sourcing**: Full state replay from event store
5. **Distributed Tracing**: OpenTelemetry integration for correlation IDs
6. **Message Deduplication**: Idempotency key support
7. **Priority Queues**: Message prioritization in event bus
8. **Dynamic Agent Loading**: Hot-reload agents without restart

## References

- [Saga Pattern](https://microservices.io/patterns/data/saga.html)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Scatter-Gather Pattern](https://www.enterpriseintegrationpatterns.com/patterns/messaging/BroadcastAggregate.html)
- [Dead Letter Queue](https://en.wikipedia.org/wiki/Dead_letter_queue)
- [Exponential Backoff](https://en.wikipedia.org/wiki/Exponential_backoff)

## See Also

- [Integration Examples](/docs/examples/orchestration-patterns.md)
- [Agent System Architecture](/docs/architecture/agent-system.md)
- [Event Bus Documentation](/packages/event-bus/README.md)
- [CREP System](/packages/crep/README.md)
