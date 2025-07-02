import React from 'react';

export function EventVisualizationDashboard({ events }: { events: any[] }) {
  return <pre data-testid="events">{JSON.stringify(events)}</pre>;
}
