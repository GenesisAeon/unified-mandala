import { useState, useEffect } from 'react';

const SymbolzeitTabelle = {
  morgen: { phase: "Initiation", farbe: "#B4E3F2" },
  tag: { phase: "Aktivierung", farbe: "#E3F4D6" },
  abend: { phase: "Integration", farbe: "#F7D9C4" },
  nacht: { phase: "Reflexion", farbe: "#2C3E50" },
};

export const useSymbolzeit = () => {
  const [symbolPhase, setSymbolPhase] = useState(SymbolzeitTabelle.tag);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setSymbolPhase(SymbolzeitTabelle.morgen);
    else if (hour >= 12 && hour < 18) setSymbolPhase(SymbolzeitTabelle.tag);
    else if (hour >= 18 && hour < 22) setSymbolPhase(SymbolzeitTabelle.abend);
    else setSymbolPhase(SymbolzeitTabelle.nacht);
  }, []);

  return symbolPhase;
};
