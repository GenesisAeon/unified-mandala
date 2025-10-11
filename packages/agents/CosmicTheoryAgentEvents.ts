import mitt, { Emitter } from 'mitt';
import { context, trace } from '@opentelemetry/api';

export interface TraceLogPayload {
  message: string;
  timestamp: number;
  spanId?: string;
  traceId?: string;
}

export type CosmicTheoryAgentEvents = {
  'sigil:generated': { sigilId: string; formula: string };
  'theory:updated': { formula: string; score: number };
  'theory:start': { dataPoints: number[] };
  'theory:regression:success': { equation: string };
  'vr:enter': { timestamp: number };
  'vr:exit': { timestamp: number };
  'trace:log': TraceLogPayload;
  [key: string]: any;
};

export const CosmicTheoryEventHub: Emitter<CosmicTheoryAgentEvents> =
  mitt<CosmicTheoryAgentEvents>();

export function logTrace(message: string): void {
  const span = trace.getSpan(context.active());
  CosmicTheoryEventHub.emit('trace:log', {
    message,
    timestamp: Date.now(),
    spanId: span?.spanContext().spanId,
    traceId: span?.spanContext().traceId,
  });
}

export function enterVR(): void {
  CosmicTheoryEventHub.emit('vr:enter', { timestamp: Date.now() });
}

export function exitVR(): void {
  CosmicTheoryEventHub.emit('vr:exit', { timestamp: Date.now() });
}
