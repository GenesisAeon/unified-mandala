import React from 'react';
import SymbolicWayfinder from './SymbolicWayfinder';

export default {
  title: 'UnifiedMandala/SymbolicWayfinder',
  component: SymbolicWayfinder,
};

export const Demo = () => (
  <SymbolicWayfinder currentCREP="1" currentSigillin="genesis" />
);
