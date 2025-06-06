import { useState, useEffect } from 'react';
import { loadSymbolphasen } from '../../shared-utils';

const SymbolzeitTabelle = loadSymbolphasen();

export const useSymbolzeit = () => {
  const [symbolPhase, setSymbolPhase] = useState(SymbolzeitTabelle.tag);

  useEffect(() => {
    const update = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setSymbolPhase(SymbolzeitTabelle.morgen);
      else if (hour >= 12 && hour < 18) setSymbolPhase(SymbolzeitTabelle.tag);
      else if (hour >= 18 && hour < 22) setSymbolPhase(SymbolzeitTabelle.abend);
      else setSymbolPhase(SymbolzeitTabelle.nacht);
    };
    update();
    const id = setInterval(update, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return symbolPhase;
};
