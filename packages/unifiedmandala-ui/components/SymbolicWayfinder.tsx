interface SymbolicWayfinderProps {
  currentCREP: string;
  currentSigillin: string;
}
const SymbolicWayfinder: React.FC<SymbolicWayfinderProps> = ({ currentCREP, currentSigillin }) => (
  <nav aria-label="Symbolischer Wegweiser">
    <p>Aktueller CREP: {currentCREP}</p>
    <p>Aktuelles Sigillin: {currentSigillin}</p>
  </nav>
);
export default SymbolicWayfinder;
