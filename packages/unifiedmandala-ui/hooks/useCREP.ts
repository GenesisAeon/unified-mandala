import { useState } from 'react';
import { CREPManager } from '../../crep-engine/CREPManager';
import { CREPEvaluator } from '../../crep-engine/CREPEvaluator';

const crepManager = new CREPManager();
const crepEvaluator = new CREPEvaluator(crepManager);

export const useCREP = () => {
  const [history, setHistory] = useState(() => crepManager.getCREPHistory());

  const triggerCREP = (data: { C: number; R: number; E: number; P: number }) => {
    crepEvaluator.evaluateNewDataPoint(data);
    setHistory([...crepManager.getCREPHistory()]);
  };

  return { history, triggerCREP };
};
