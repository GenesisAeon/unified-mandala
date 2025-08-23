import React from 'react';
import FeatureFlagsPanel from './FeatureFlagsPanel';
import AgentControlPanel from './AgentControlPanel';

/**
 * ResearchHub provides an entry point for research agents and feature flags.
 * Guidance sourced via newadvancedconversations parsing utilities.
 */
export default function ResearchHub() {
  return (
    <div aria-label="ResearchHub">
      <h2>Research Hub</h2>
      <AgentControlPanel />
      <FeatureFlagsPanel />
    </div>
  );
}
