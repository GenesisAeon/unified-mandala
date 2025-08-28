import React from 'react';
import ResearchHub from '../unifiedmandala-ui/components/ResearchHub';
import VoicePanel from '../unifiedmandala-ui/components/VoicePanel';

/**
 * CommonsApp combines research and voice panels into a human-first hub.
 */
export default function CommonsApp() {
  return (
    <div aria-label="CommonsApp">
      <h1>Commons Hub</h1>
      <ResearchHub />
      <VoicePanel />
    </div>
  );
}
