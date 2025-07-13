import { useCREP } from './useCREP';
import { getCREPTuning, CREPTuning } from '../../shared-utils/crepHelpers';
import { useMemo } from 'react';

export function useCREPTuning(): CREPTuning {
  const { history } = useCREP();
  return useMemo(() => {
    const latest = history[history.length - 1];
    return latest ? getCREPTuning(latest) : { color: 'gray', frequency: 0 };
  }, [history]);
}
