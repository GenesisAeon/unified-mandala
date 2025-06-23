import React from 'react';
import AdminMetrics from './AdminMetrics';
import { useAdminMetrics } from '../hooks/useAdminMetrics';

export default {
  title: 'Components/AdminMetrics',
  component: AdminMetrics,
};

export const Default = () => {
  const { metrics } = useAdminMetrics();
  if (!metrics) return <div>loading...</div>;
  return (
    <AdminMetrics
      avgCREP={metrics.avgCREP}
      sigillinAdoption={metrics.sigillinAdoption}
      openTodos={metrics.openTodos}
    />
  );
};
