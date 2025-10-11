import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CREPManager } from '../../crep-engine/CREPManager';
import { CREPEvaluator } from '../../crep-engine/CREPEvaluator';
import { CREPEntry } from '../../crep-engine/types';

interface CREPState {
  history: CREPEntry[];
}

type Action = { type: 'ADD'; entry: CREPEntry } | { type: 'RESET' };

const crepManager = new CREPManager();
const crepEvaluator = new CREPEvaluator(crepManager);

const CREPContext = createContext<{
  state: CREPState;
  triggerCREP: (data: { C: number; R: number; E: number; P: number }) => void;
}>({
  state: { history: [] },
  triggerCREP: () => {},
});

function crepReducer(state: CREPState, action: Action): CREPState {
  switch (action.type) {
    case 'ADD':
      return { history: [...state.history, action.entry] };
    case 'RESET':
      return { history: [] };
    default:
      return state;
  }
}

export const CREPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(crepReducer, {
    history: crepManager.getCREPHistory(),
  });

  const triggerCREP = (data: { C: number; R: number; E: number; P: number }) => {
    crepEvaluator.evaluateNewDataPoint(data);
    const history = crepManager.getCREPHistory();
    dispatch({ type: 'ADD', entry: history[history.length - 1] });
  };

  return <CREPContext.Provider value={{ state, triggerCREP }}>{children}</CREPContext.Provider>;
};

export const useCREPContext = () => useContext(CREPContext);
