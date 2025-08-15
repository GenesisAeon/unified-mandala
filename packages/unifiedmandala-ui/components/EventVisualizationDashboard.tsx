import React from 'react';

export interface EventData {
  type: string;
  payload?: unknown;
}

export interface EventVisualizationDashboardProps {
  events: EventData[];
}

export const EventVisualizationDashboard: React.FC<EventVisualizationDashboardProps> = ({ events }) => {
  const counts = events.reduce<Record<string, number>>((acc, evt) => {
    acc[evt.type] = (acc[evt.type] || 0) + 1;
    return acc;
    }, {});
  return (
    <div aria-label="event-visualization-dashboard">
      <ul>
        {Object.entries(counts).map(([type, count]) => (
          <li key={type}>{`${type}: ${count}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventVisualizationDashboard;
