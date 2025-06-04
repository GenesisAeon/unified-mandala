import FocusTrap from 'focus-trap-react';

interface AeonStoryModeProps {
  storyId: string;
  onExit: () => void;
}
const AeonStoryMode: React.FC<AeonStoryModeProps> = ({ storyId, onExit }) => (
  <FocusTrap>
    <div role="dialog" aria-modal="true" aria-labelledby="story-title">
      <h2 id="story-title">Story-Modus</h2>
      <p>Story ID: {storyId}</p>
      <button onClick={onExit}>Beenden</button>
    </div>
  </FocusTrap>
);
export default AeonStoryMode;
