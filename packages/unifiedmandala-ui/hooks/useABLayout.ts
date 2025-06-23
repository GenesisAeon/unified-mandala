import { useEffect, useState } from 'react';
import { sendABMetric } from '../../../services/crep-metrics';

export type LayoutVariant = 'A' | 'B';

export function useABLayout(): LayoutVariant {
  const [variant] = useState<LayoutVariant>(() => (Math.random() > 0.5 ? 'A' : 'B'));
  useEffect(() => {
    sendABMetric(variant);
  }, [variant]);
  return variant;
}
