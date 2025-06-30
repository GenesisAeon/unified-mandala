import { recordABVariant } from './metrics';

export function sendABMetric(variant: 'A' | 'B') {
  recordABVariant(variant);
}
