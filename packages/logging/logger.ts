import pino from 'pino';
import { getCtx } from './context';
const level = process.env.LOG_LEVEL || 'info';
export const logger = pino({ level, base: undefined, timestamp: pino.stdTimeFunctions.isoTime });
export function logWithContext() {
  const c = getCtx();
  return logger.child({ reqId: c.requestId, agent: c.agent, user: c.user, ...c.extra });
}
export async function shutdownLogger() {
  await new Promise<void>((res) => ((logger as any).flush ? (logger as any).flush(res) : res()));
}
