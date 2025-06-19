import { useMetaScores } from '../hooks/useMetaScores';

export default function MetaScoreDisplay() {
  const scores = useMetaScores();

  if (!scores.length) return <div>Keine Meta-Scores verfügbar.</div>;

  return (
    <ul>
      {scores.map((s) => (
        <li key={s.id}>{s.id}: {s.value}</li>
      ))}
    </ul>
  );
}
