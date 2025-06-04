import FocusTrap from 'focus-trap-react';

interface SoforthilfeOverlayProps {
  triggerCondition: boolean;
  onResolve: () => void;
}
const SoforthilfeOverlay: React.FC<SoforthilfeOverlayProps> = ({ triggerCondition, onResolve }) => {
  if (!triggerCondition) return null;
  return (
    <FocusTrap>
      <div role="dialog" aria-modal="true" aria-labelledby="overlay-title">
        <h2 id="overlay-title">Notfallmodus aktiv</h2>
        <p>Soforthilfe erforderlich!</p>
        <button onClick={onResolve}>OK</button>
      </div>
    </FocusTrap>
  );
};
export default SoforthilfeOverlay;
