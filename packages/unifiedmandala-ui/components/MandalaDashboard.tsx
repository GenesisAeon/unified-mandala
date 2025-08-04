import React from 'react';
import SyncStatus from './SyncStatus';
import ConversationStats, { ConversationStatsProps } from './ConversationStats';

export interface ModuleStatus {
  name: string;
  status: 'synced' | 'pending' | 'error';
}

interface MandalaDashboardProps {
  modules: ModuleStatus[];
  conversationStats?: ConversationStatsProps;
}

const MandalaDashboard: React.FC<MandalaDashboardProps> = ({ modules, conversationStats }) => (
  <div aria-label="Mandala Dashboard">
    <h3>Module Synchronisation</h3>
    <ul>
      {modules.map((m) => (
        <li key={m.name}>
          <span>{m.name}:</span> <SyncStatus status={m.status} />
        </li>
      ))}
    </ul>
    {conversationStats && (
      <ConversationStats
        conversationCount={conversationStats.conversationCount}
        messageCount={conversationStats.messageCount}
      />
    )}
  </div>
);

export default MandalaDashboard;
