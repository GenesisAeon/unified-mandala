import { EthicsGuard } from '../core/EthicsGuard';

export const sanitizeInput = (content: string): string | null => {
  const guard = new EthicsGuard();
  return guard.isSafe(content) ? content : null;
};
