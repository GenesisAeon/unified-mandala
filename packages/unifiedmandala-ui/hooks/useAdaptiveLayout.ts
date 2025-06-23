import { useCREPContext } from '../contexts/CREPContext';
import { useMemo } from 'react';
import { latestCREPStatus } from '../../../services/crep-state';

export interface LayoutStyle {
  gridTemplateAreas: string;
}

export function useAdaptiveLayout(): LayoutStyle {
  const { state } = useCREPContext();
  return useMemo(() => {
    const status = latestCREPStatus(state.history);
    switch (status) {
      case 'critical':
        return { gridTemplateAreas: `'header' 'main' 'alert'` };
      case 'warning':
        return { gridTemplateAreas: `'header header' 'main sidebar'` };
      default:
        return { gridTemplateAreas: `'header header' 'sidebar main'` };
    }
  }, [state.history]);
}
