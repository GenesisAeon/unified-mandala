import { promises as fs } from 'fs';
import path from 'path';

/**
 * AgentHeartbeat automatically registers an agent and periodically
 * emits heartbeat events to a JSONL log file.
 */
export class AgentHeartbeat {
  private intervalId?: NodeJS.Timeout;
  private readonly logFile: string;

  constructor(
    private agentId: string,
    private intervalMs = 60000,
    logFile?: string,
  ) {
    this.logFile = logFile ?? path.resolve('data/agents/heartbeats.jsonl');
    this.register().catch(console.error);
    this.start();
  }

  /**
   * Append an event record to the heartbeat log file.
   */
  private async append(event: Record<string, unknown>): Promise<void> {
    await fs.mkdir(path.dirname(this.logFile), { recursive: true });
    await fs.appendFile(this.logFile, JSON.stringify(event) + '\n');
  }

  /**
   * Register the agent in the log.
   */
  private async register(): Promise<void> {
    await this.append({
      type: 'register',
      agentId: this.agentId,
      ts: new Date().toISOString(),
    });
  }

  /**
   * Start emitting heartbeat events on the configured interval.
   */
  start(): void {
    this.intervalId = setInterval(() => {
      this.append({
        type: 'heartbeat',
        agentId: this.agentId,
        ts: new Date().toISOString(),
      }).catch(console.error);
    }, this.intervalMs);
  }

  /**
   * Stop emitting heartbeat events.
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
