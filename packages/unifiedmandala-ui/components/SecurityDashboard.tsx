import React from 'react';

export interface Vulnerability {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface SecurityDashboardProps {
  vulnerabilities: Vulnerability[];
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ vulnerabilities }) => (
  <div>
    <h2>Security Dashboard</h2>
    <ul>
      {vulnerabilities.map((v) => (
        <li key={v.id}>
          <strong>{v.severity.toUpperCase()}:</strong> {v.description}
        </li>
      ))}
    </ul>
  </div>
);

export default SecurityDashboard;
