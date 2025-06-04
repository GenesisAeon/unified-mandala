import React from 'react';
import AeonStoryMode from './AeonStoryMode';

export default {
  title: 'UnifiedMandala/AeonStoryMode',
  component: AeonStoryMode,
};

export const Beispiel = () => (
  <AeonStoryMode storyId="42" onExit={() => alert('exit')} />
);
