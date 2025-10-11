import { requireConsent } from '../../personhood/PolicyGuard';
import { GPTEventHub } from '../GPTEventHub';

/**
 * Wraps a handler with a personhood consent check and audit emission.
 * Throws if consent is missing and emits a `personhood-check` event.
 */
export function withPersonhood<T extends (...args: any[]) => any>(
  handler: T,
  personId: string,
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    requireConsent(personId);
    GPTEventHub.emit('personhood-check', {
      personId,
      tool: handler.name || 'anonymous',
    });
    return handler(...args);
  };
}
