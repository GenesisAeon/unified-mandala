import { EventEmitter } from 'events';
import { Subjects } from './subjects';

/**
 * LocalEventBus provides an in-memory event bus implementation used for
 * lightweight testing or environments where a full message broker is not
 * required. It mirrors the publish/subscribe API of NatsEventBus but relies on
 * Node's EventEmitter under the hood.
 */
export class LocalEventBus {
  private emitter = new EventEmitter();

  /**
     * Publish a payload to a subject.
     * @param subject The event subject.
     * @param payload Data to emit.
     */
  publish(subject: Subjects, payload: unknown): void {
    this.emitter.emit(subject, payload);
  }

  /**
     * Subscribe to a subject.
     * @param subject The event subject.
     * @param handler Callback invoked with the payload.
     * @returns Function to unsubscribe.
     */
  subscribe(subject: Subjects, handler: (data: unknown) => void): () => void {
    this.emitter.on(subject, handler);
    return () => this.emitter.off(subject, handler);
  }

  /**
     * Remove all listeners and reset the bus.
     */
  close(): void {
    this.emitter.removeAllListeners();
  }
}

