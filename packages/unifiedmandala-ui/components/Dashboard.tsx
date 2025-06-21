import React from 'react';
import { useMetaScores } from '../hooks/useMetaScores';
import MetaScoreChart from './MetaScoreChart';

const Dashboard: React.FC = () => {
  const data = useMetaScores();
  return (
    <div>
      <h2>Meta Scores</h2>
      <MetaScoreChart data={data || []} />
    </div>
  );
};

export default Dashboard;
