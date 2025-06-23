import React from 'react';
import ChatPanel from './ChatPanel';
import { CREPProvider } from '../contexts/CREPContext';

export default {
  title: 'UnifiedMandala/ChatPanel',
  component: ChatPanel,
};

export const Demo = () => (
  <CREPProvider>
    <ChatPanel />
  </CREPProvider>
);
