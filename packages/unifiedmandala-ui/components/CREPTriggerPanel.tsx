import { useCREP } from '../hooks/useCREP';

interface CREPTriggerPanelProps {
  availableTriggers: Array<{ label: string; data: { C: number; R: number; E: number; P: number } }>;
}

const CREPTriggerPanel: React.FC<CREPTriggerPanelProps> = ({ availableTriggers }) => {
  const { triggerCREP } = useCREP();
  return (
    <div aria-label="CREP Trigger Panel">
      {availableTriggers.map((t) => (
        <button key={t.label} onClick={() => triggerCREP(t.data)} aria-label={`Trigger ${t.label}`}>
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default CREPTriggerPanel;
