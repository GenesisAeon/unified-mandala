import React from 'react';
import SigilStory from './SigilStory';

export default {
  title: 'UnifiedMandala/SigilStory',
  component: SigilStory,
};

const sample = [
  { name: 'C-Tutor', milestones: [{ sigil: 'c1', hint: 'Init', time: 1 }] },
  { name: 'JavaHamster', milestones: [{ sigil: 'j1', hint: 'Start', time: 1 }] },
];

export const Overview = () => <SigilStory paths={sample} />;
