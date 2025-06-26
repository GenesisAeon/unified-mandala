import { useMemo } from 'react';
import { CREPManager } from '../../crep-engine/CREPManager';

export const useCREPManager = () => {
  return useMemo(() => new CREPManager(), []);
};
