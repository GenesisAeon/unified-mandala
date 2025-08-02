import React from 'react';
import SyncStatus from './SyncStatus';

export interface ModuleStatus {
  name: string;
  status: 'synced' | 'pending' | 'error';
}

interface MandalaDashboardProps {
  modules: ModuleStatus[];
}

const MandalaDashboard: React.FC<MandalaDashboardProps> = ({ modules }) => (
  <div aria-label="Mandala Dashboard">
    <h3>Module Synchronisation</h3>
    <ul>
      {modules.map((m) => (
        <li key={m.name}>
          <span>{m.name}:</span> <SyncStatus status={m.status} />
        </li>
      ))}
    </ul>
  </div>
);

export default MandalaDashboard;
