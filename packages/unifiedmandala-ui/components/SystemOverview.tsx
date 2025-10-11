import React from 'react';

export interface ServiceStatus {
  name: string;
  healthy: boolean;
}

export interface SystemOverviewProps {
  services: ServiceStatus[];
}

const SystemOverview: React.FC<SystemOverviewProps> = ({ services }) => {
  return (
    <div>
      <h2>System Overview</h2>
      <ul>
        {services.map((svc) => (
          <li key={svc.name}>
            {svc.name}: {svc.healthy ? '🟢' : '🔴'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SystemOverview;
