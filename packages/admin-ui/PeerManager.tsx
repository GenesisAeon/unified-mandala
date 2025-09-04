import React from 'react';

export interface Peer {
  id: string;
  role: string;
  trust: number;
}

export interface PeerManagerProps {
  peers: Peer[];
}

/**
 * PeerManager renders a simple table of registered AI peers.
 * Each peer displays its id, assigned role and trust score.
 */
const PeerManager: React.FC<PeerManagerProps> = ({ peers }) => (
  <div>
    <h2>Peer Manager</h2>
    <table>
      <thead>
        <tr>
          <th>Peer</th>
          <th>Role</th>
          <th>Trust</th>
        </tr>
      </thead>
      <tbody>
        {peers.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.role}</td>
            <td>{p.trust}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PeerManager;
