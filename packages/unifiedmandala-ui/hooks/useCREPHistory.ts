import { useState, useEffect } from 'react';
import { CREPManager } from '../../crep-engine/CREPManager';

export const useCREPHistory = (manager: CREPManager) => {
  const [history, setHistory] = useState(manager.getCREPHistory());

  useEffect(() => {
    const id = setInterval(() => {
      setHistory([...manager.getCREPHistory()]);
    }, 1000);
    return () => clearInterval(id);
  }, [manager]);

  return history;
};
