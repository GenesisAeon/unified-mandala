import React from 'react';

interface SigillinEvent {
  id: string;
  timestamp: string;
}

interface SigillinTimelineProps {
  events: SigillinEvent[];
}

const SigillinTimeline: React.FC<SigillinTimelineProps> = ({ events }) => (
  <ul aria-label="Sigillin Timeline">
    {events.map((e) => (
      <li key={e.id}>
        {e.id} – {new Date(e.timestamp).toLocaleString()}
      </li>
    ))}
  </ul>
);

export default SigillinTimeline;
