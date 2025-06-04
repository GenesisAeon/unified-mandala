interface SigillinMapProps {
  sigillinData: Array<{ id: string; status: string }>;
}
const SigillinMap: React.FC<SigillinMapProps> = ({ sigillinData }) => (
  <div aria-label="Sigillin-Karte">
    {sigillinData.map(sigillin => (
      <div
        key={sigillin.id}
        style={{ backgroundColor: sigillin.status === 'aktiv' ? '#00FF99' : '#CCCCCC' }}
        role="button"
        aria-pressed={sigillin.status === 'aktiv'}
      >
        {sigillin.id}
      </div>
    ))}
  </div>
);
export default SigillinMap;
