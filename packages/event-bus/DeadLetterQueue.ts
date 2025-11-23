/**
 * DeadLetterQueue - Captures and manages failed messages for analysis and recovery
 *
 * When messages fail processing after all retry attempts, they are routed to the DLQ
 * for manual inspection, debugging, and potential recovery. This prevents message loss
 * and enables visibility into systemic failures.
 *
 * Features:
 * - Automatic routing of failed messages after max retries
 * - Categorization by failure type (validation, timeout, processing)
 * - Message replay capabilities
 * - Metrics and monitoring integration
 * - Configurable retention and archival
 *
 * @example
 * ```typescript
 * const dlq = new DeadLetterQueue(eventBus, {
 *   maxSize: 10000,
 *   retentionMs: 7 * 24 * 60 * 60 * 1000 // 7 days
 * });
 *
 * // Failed message automatically routed to DLQ
 * await dlq.send({
 *   originalSubject: 'v1.agent.task',
 *   message: failedTask,
 *   error: error,
 *   attempts: 3,
 *   failureType: 'timeout'
 * });
 *
 * // Later, retrieve and replay
 * const failed = await dlq.getMessages({ limit: 10 });
 * for (const msg of failed) {
 *   await dlq.replay(msg.id);
 * }
 * ```
 */

import { Subjects } from './subjects';

// Simple event bus interface for DLQ
export interface EventBus {
  publish(subject: Subjects, payload: unknown): Promise<void> | void;
  subscribe(subject: Subjects, handler: (data: unknown) => void): void | (() => void);
}

export type FailureType = 'validation' | 'timeout' | 'processing' | 'unknown';

export interface DeadLetterMessage {
  /** Unique message ID */
  id: string;

  /** Original subject where message was published */
  originalSubject: Subjects;

  /** The failed message content */
  message: unknown;

  /** Error that caused the failure */
  error: Error;

  /** Number of processing attempts before DLQ */
  attempts: number;

  /** Type of failure */
  failureType: FailureType;

  /** Timestamp when message entered DLQ */
  timestamp: string;

  /** Additional metadata */
  metadata?: Record<string, unknown>;

  /** Whether message has been replayed */
  replayed?: boolean;

  /** Timestamp of replay attempt if any */
  replayedAt?: string;
}

export interface DLQConfig {
  /** Maximum number of messages to retain (default: 10000) */
  maxSize?: number;

  /** Retention period in milliseconds (default: 7 days) */
  retentionMs?: number;

  /** Auto-archive old messages (default: false) */
  autoArchive?: boolean;

  /** Callback when message enters DLQ */
  onMessage?: (message: DeadLetterMessage) => void;

  /** Callback when DLQ is full */
  onFull?: (currentSize: number) => void;
}

export interface DLQFilter {
  /** Filter by failure type */
  failureType?: FailureType;

  /** Filter by original subject */
  originalSubject?: Subjects;

  /** Filter messages after this timestamp */
  after?: Date;

  /** Filter messages before this timestamp */
  before?: Date;

  /** Include replayed messages (default: false) */
  includeReplayed?: boolean;

  /** Maximum number of messages to return */
  limit?: number;
}

export interface DLQStats {
  /** Total messages in DLQ */
  totalMessages: number;

  /** Messages by failure type */
  byFailureType: Record<FailureType, number>;

  /** Messages by original subject */
  bySubject: Record<string, number>;

  /** Oldest message timestamp */
  oldestMessage?: string;

  /** Newest message timestamp */
  newestMessage?: string;

  /** Number of replayed messages */
  replayedCount: number;

  /** Average attempts before DLQ */
  averageAttempts: number;
}

export class DeadLetterQueue {
  private messages: Map<string, DeadLetterMessage> = new Map();
  private config: Required<DLQConfig>;
  private eventBus: EventBus;
  private cleanupTimer?: NodeJS.Timeout;

  constructor(eventBus: EventBus, config: DLQConfig = {}) {
    this.eventBus = eventBus;
    this.config = {
      maxSize: config.maxSize ?? 10000,
      retentionMs: config.retentionMs ?? 7 * 24 * 60 * 60 * 1000, // 7 days
      autoArchive: config.autoArchive ?? false,
      onMessage: config.onMessage ?? (() => {}),
      onFull: config.onFull ?? (() => {}),
    };

    // Start cleanup timer if retention is configured
    if (this.config.retentionMs > 0 && this.config.autoArchive) {
      this.startCleanupTimer();
    }

    // Subscribe to DLQ subjects
    this.subscribeToDLQ();
  }

  /**
   * Send a failed message to the DLQ
   */
  async send(params: {
    originalSubject: Subjects;
    message: unknown;
    error: Error;
    attempts: number;
    failureType?: FailureType;
    metadata?: Record<string, unknown>;
  }): Promise<DeadLetterMessage> {
    // Check if DLQ is full
    if (this.messages.size >= this.config.maxSize) {
      this.config.onFull(this.messages.size);
      // Remove oldest message to make space
      this.removeOldest();
    }

    const dlqMessage: DeadLetterMessage = {
      id: this.generateId(),
      originalSubject: params.originalSubject,
      message: params.message,
      error: params.error,
      attempts: params.attempts,
      failureType: params.failureType ?? this.inferFailureType(params.error),
      timestamp: new Date().toISOString(),
      metadata: params.metadata,
    };

    // Store message
    this.messages.set(dlqMessage.id, dlqMessage);

    // Publish to appropriate DLQ subject
    const subject = this.getSubjectForFailureType(dlqMessage.failureType);
    await this.eventBus.publish(subject, dlqMessage);

    // Invoke callback
    this.config.onMessage(dlqMessage);

    return dlqMessage;
  }

  /**
   * Get messages from DLQ with optional filtering
   */
  getMessages(filter: DLQFilter = {}): DeadLetterMessage[] {
    let results = Array.from(this.messages.values());

    // Apply filters
    if (filter.failureType) {
      results = results.filter((m) => m.failureType === filter.failureType);
    }

    if (filter.originalSubject) {
      results = results.filter((m) => m.originalSubject === filter.originalSubject);
    }

    if (filter.after) {
      results = results.filter(
        (m) => new Date(m.timestamp) >= filter.after!,
      );
    }

    if (filter.before) {
      results = results.filter(
        (m) => new Date(m.timestamp) <= filter.before!,
      );
    }

    if (!filter.includeReplayed) {
      results = results.filter((m) => !m.replayed);
    }

    // Sort by timestamp (newest first)
    results.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply limit
    if (filter.limit && filter.limit > 0) {
      results = results.slice(0, filter.limit);
    }

    return results;
  }

  /**
   * Replay a message by republishing to original subject
   */
  async replay(messageId: string): Promise<boolean> {
    const message = this.messages.get(messageId);
    if (!message) {
      return false;
    }

    try {
      // Republish to original subject
      await this.eventBus.publish(message.originalSubject, message.message);

      // Mark as replayed
      message.replayed = true;
      message.replayedAt = new Date().toISOString();

      return true;
    } catch (error) {
      // Replay failed, keep in DLQ
      return false;
    }
  }

  /**
   * Replay multiple messages matching filter
   */
  async replayBatch(filter: DLQFilter = {}): Promise<{ succeeded: number; failed: number }> {
    const messages = this.getMessages(filter);
    let succeeded = 0;
    let failed = 0;

    for (const message of messages) {
      const success = await this.replay(message.id);
      if (success) {
        succeeded++;
      } else {
        failed++;
      }
    }

    return { succeeded, failed };
  }

  /**
   * Remove a message from DLQ
   */
  remove(messageId: string): boolean {
    return this.messages.delete(messageId);
  }

  /**
   * Clear all messages from DLQ
   */
  clear(filter?: DLQFilter): number {
    if (!filter) {
      const size = this.messages.size;
      this.messages.clear();
      return size;
    }

    const toRemove = this.getMessages(filter);
    for (const message of toRemove) {
      this.messages.delete(message.id);
    }
    return toRemove.length;
  }

  /**
   * Get DLQ statistics
   */
  getStats(): DLQStats {
    const messages = Array.from(this.messages.values());

    const stats: DLQStats = {
      totalMessages: messages.length,
      byFailureType: {
        validation: 0,
        timeout: 0,
        processing: 0,
        unknown: 0,
      },
      bySubject: {},
      replayedCount: 0,
      averageAttempts: 0,
    };

    if (messages.length === 0) {
      return stats;
    }

    let totalAttempts = 0;
    const timestamps = messages.map((m) => m.timestamp).sort();

    stats.oldestMessage = timestamps[0];
    stats.newestMessage = timestamps[timestamps.length - 1];

    for (const message of messages) {
      // Count by failure type
      stats.byFailureType[message.failureType]++;

      // Count by subject
      stats.bySubject[message.originalSubject] =
        (stats.bySubject[message.originalSubject] || 0) + 1;

      // Count replayed
      if (message.replayed) {
        stats.replayedCount++;
      }

      // Sum attempts
      totalAttempts += message.attempts;
    }

    stats.averageAttempts = totalAttempts / messages.length;

    return stats;
  }

  /**
   * Subscribe to DLQ subjects
   */
  private subscribeToDLQ(): void {
    // Subscribe to general DLQ for monitoring
    this.eventBus.subscribe(Subjects.DLQ, (data: unknown) => {
      // Already handled by send(), this is for external monitoring
    });
  }

  /**
   * Infer failure type from error
   */
  private inferFailureType(error: Error): FailureType {
    const message = error.message.toLowerCase();
    if (message.includes('timeout')) return 'timeout';
    if (message.includes('validation') || message.includes('invalid')) {
      return 'validation';
    }
    return 'processing';
  }

  /**
   * Get subject for failure type
   */
  private getSubjectForFailureType(type: FailureType): Subjects {
    switch (type) {
      case 'validation':
        return Subjects.DLQ_VALIDATION;
      case 'timeout':
        return Subjects.DLQ_TIMEOUT;
      default:
        return Subjects.DLQ;
    }
  }

  /**
   * Generate unique message ID
   */
  private generateId(): string {
    return `dlq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Remove oldest message
   */
  private removeOldest(): void {
    const messages = Array.from(this.messages.entries());
    messages.sort((a, b) =>
      new Date(a[1].timestamp).getTime() - new Date(b[1].timestamp).getTime()
    );

    if (messages.length > 0) {
      this.messages.delete(messages[0][0]);
    }
  }

  /**
   * Start cleanup timer for automatic archival
   */
  private startCleanupTimer(): void {
    // Run cleanup every hour
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, 60 * 60 * 1000);
  }

  /**
   * Clean up old messages based on retention policy
   */
  private cleanup(): void {
    const cutoff = new Date(Date.now() - this.config.retentionMs);
    const removed = this.clear({
      before: cutoff,
      includeReplayed: true,
    });

    if (removed > 0) {
      console.log(`[DLQ] Archived ${removed} messages older than ${cutoff.toISOString()}`);
    }
  }

  /**
   * Stop cleanup timer and cleanup resources
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }
}

/**
 * Helper function to wrap agent execution with DLQ support
 */
export async function withDLQ(
  dlq: DeadLetterQueue,
  subject: Subjects,
  message: unknown,
  fn: () => Promise<void>,
  maxAttempts: number = 3,
): Promise<void> {
  let attempts = 0;
  let lastError: Error | undefined;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      await fn();
      return; // Success!
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempts >= maxAttempts) {
        // Send to DLQ after max attempts
        await dlq.send({
          originalSubject: subject,
          message,
          error: lastError,
          attempts,
        });
        throw lastError; // Re-throw after sending to DLQ
      }

      // Wait before retry (simple exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, attempts - 1)));
    }
  }
}
