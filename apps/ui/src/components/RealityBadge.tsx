export default function RealityBadge({
  score,
  decision,
}: {
  score: number;
  decision: 'external' | 'ambiguous' | 'imaginative';
}) {
  const label =
    decision === 'external'
      ? '🧭 external'
      : decision === 'ambiguous'
        ? '🫧 ambiguous'
        : '🎭 imaginative';
  const bg = decision === 'external' ? '#1b5e20' : decision === 'ambiguous' ? '#ef6c00' : '#6a1b9a';
  return (
    <span
      style={{
        background: bg,
        color: '#fff',
        padding: '2px 6px',
        borderRadius: 6,
        fontSize: 12,
        opacity: 0.9,
      }}
      title={`score ${score.toFixed(2)}`}
    >
      {label}
    </span>
  );
}
