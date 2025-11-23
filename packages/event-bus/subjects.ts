export enum Subjects {
  /**
   * Emitted when CREP metrics change.
   * The `v1` prefix allows future event versioning without breaking
   * existing listeners.
   */
  CREP_UPDATE = 'v1.crep.update',
  /**
   * Heartbeat events emitted by agents to signal liveness.
   * Versioned for forward compatibility.
   */
  AGENT_HEARTBEAT = 'v1.agent.heartbeat',
  /**
   * Periodic health summaries emitted by agents to report status.
   */
  AGENT_HEALTH = 'v1.agent.health',
  /**
   * Error events emitted when an agent encounters a failure.
   */
  AGENT_ERROR = 'v1.agent.error',
  /**
   * Client submitted live question.
   */
  LIVE_ASK = 'v1.live.ask',
  /**
   * Response event for live questions.
   */
  LIVE_ANSWER = 'v1.live.answer',
  /**
   * Dead Letter Queue for failed messages that could not be processed
   * after maximum retry attempts. Enables analysis and manual recovery.
   */
  DLQ = 'v1.dlq',
  /**
   * Dead Letter Queue for messages that failed due to validation errors.
   */
  DLQ_VALIDATION = 'v1.dlq.validation',
  /**
   * Dead Letter Queue for messages that failed due to timeout.
   */
  DLQ_TIMEOUT = 'v1.dlq.timeout',
}
