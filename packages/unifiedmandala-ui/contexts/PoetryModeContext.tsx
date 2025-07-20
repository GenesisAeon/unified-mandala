import React, { createContext, useContext, useState } from 'react';

interface PoetryModeContextValue {
  enabled: boolean;
  toggle: () => void;
}

const PoetryModeContext = createContext<PoetryModeContextValue>({
  enabled: false,
  toggle: () => {},
});

export const PoetryModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enabled, setEnabled] = useState(false);
  const toggle = () => setEnabled(e => !e);
  return (
    <PoetryModeContext.Provider value={{ enabled, toggle }}>
      {children}
    </PoetryModeContext.Provider>
  );
};

export const usePoetryMode = () => useContext(PoetryModeContext);
export default PoetryModeContext;
