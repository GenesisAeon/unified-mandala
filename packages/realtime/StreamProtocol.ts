/**
 * StreamProtocol defines message shapes for the realtime hub.
 * Each message is wrapped in an envelope that carries a protocol
 * version for forward/backward compatibility.
 */

export const PROTOCOL_VERSION = '1.0';

/**
 * Core message types exchanged with the realtime hub.
 */
export type LiveMsg =
  | { type: 'ping'; ts: number }
  | { type: 'pong'; ts: number }
  | { type: 'subscribe'; channel: string }
  | { type: 'unsubscribe'; channel: string }
  | { type: 'event'; channel: string; payload: unknown };

/**
 * Envelope sent over the wire.
 */
export interface StreamEnvelope<T extends LiveMsg = LiveMsg> {
  /** protocol version */
  v: string;
  /** wrapped message */
  msg: T;
}

/**
 * Helper to wrap a message in a protocol envelope.
 */
export function wrap<T extends LiveMsg>(msg: T): StreamEnvelope<T> {
  return { v: PROTOCOL_VERSION, msg };
}
