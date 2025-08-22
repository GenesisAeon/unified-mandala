import React from 'react';

export interface EventStreamPanelProps {
  events: any[];
}

export const EventStreamPanel: React.FC<EventStreamPanelProps> = ({ events }) => (
  <div aria-label="event-stream-panel" style={{ maxHeight: '200px', overflowY: 'auto' }}>
    <ul>
      {events.map((ev, idx) => (
        <li key={idx} aria-label={`event-${idx}`}>
          <pre>{JSON.stringify(ev)}</pre>
        </li>
      ))}
    </ul>
  </div>
);

export default EventStreamPanel;
