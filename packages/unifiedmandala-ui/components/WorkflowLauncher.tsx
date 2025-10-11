import React, { useState } from 'react';

export interface WorkflowLauncherProps {
  endpoint?: string;
  label?: string;
  onLaunch?: (success: boolean) => void;
}

const WorkflowLauncher: React.FC<WorkflowLauncherProps> = ({
  endpoint = '/api/sigillin/workflow',
  label = 'Launch Sigillin Workflow',
  onLaunch,
}) => {
  const [loading, setLoading] = useState(false);

  const launch = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      onLaunch?.(res.ok);
    } catch {
      onLaunch?.(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button aria-label="launch-workflow" onClick={launch} disabled={loading}>
      {loading ? 'Launching...' : label}
    </button>
  );
};

export default WorkflowLauncher;
