interface CREPTriggerPanelProps {
  availableTriggers: string[];
  onTrigger: (trigger: string) => void;
}
const CREPTriggerPanel: React.FC<CREPTriggerPanelProps> = ({ availableTriggers, onTrigger }) => (
  <div aria-label="CREP Trigger Panel">
    {availableTriggers.map(trigger => (
      <button key={trigger} onClick={() => onTrigger(trigger)} aria-label={`Trigger ${trigger}`}>
        {trigger}
      </button>
    ))}
  </div>
);
export default CREPTriggerPanel;
