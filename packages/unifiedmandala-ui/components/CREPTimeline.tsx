import React from 'react';
import { CREPEntry } from '../../crep-engine/types';

export interface CREPTimelineProps {
  events: CREPEntry[];
}

const CREPTimeline: React.FC<CREPTimelineProps> = ({ events }) => (
  <ul aria-label="CREP Timeline">
    {events.map(e => (
      <li key={e.timestamp.toString()}>
        {new Date(e.timestamp).toLocaleString()} – C:{e.C} R:{e.R} E:{e.E} P:{e.P}
      </li>
    ))}
  </ul>
);

export default CREPTimeline;
