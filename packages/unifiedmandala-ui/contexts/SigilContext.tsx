import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SigilManager } from '../../shared-utils/SigilManager';
import sigillinNodes from '../data/sigillin_nodes.json';

interface SigilContextValue {
  manager: SigilManager;
}

const SigilContext = createContext<SigilContextValue | undefined>(undefined);

export const SigilProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [manager] = useState(() => new SigilManager());

  useEffect(() => {
    // preload default sigils from data file
    (sigillinNodes as any[]).forEach((entry) => manager.add({ id: entry.id, data: entry }));
  }, [manager]);

  const value = useMemo(() => ({ manager }), [manager]);
  return <SigilContext.Provider value={value}>{children}</SigilContext.Provider>;
};

export function useSigilManager(): SigilManager {
  const ctx = useContext(SigilContext);
  if (!ctx) throw new Error('useSigilManager must be used within SigilProvider');
  return ctx.manager;
}

export default SigilContext;
