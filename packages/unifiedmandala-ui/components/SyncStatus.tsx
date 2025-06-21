import React from 'react';

interface Props {
  status: 'synced' | 'pending' | 'error';
}

const colors: Record<Props['status'], string> = {
  synced: 'green',
  pending: 'orange',
  error: 'red',
};

const SyncStatus: React.FC<Props> = ({ status }) => (
  <span style={{ color: colors[status] }} data-testid="sync-status">
    {status}
  </span>
);

export default SyncStatus;
