import React from 'react';
import TodoButton from './TodoButton';

interface Props {
  onSigil?: () => void;
  onTodos?: (data: any) => void;
  onMatch?: () => void;
}

const UsecaseComponents: React.FC<Props> = ({ onSigil, onTodos, onMatch }) => (
  <div aria-label="Usecase Components">
    <button aria-label="Generate Sigil" onClick={onSigil}>
      Generate Sigil
    </button>
    <TodoButton onComplete={onTodos} />
    <button aria-label="Match SocialGood" onClick={onMatch}>
      Match SocialGood
    </button>
  </div>
);

export default UsecaseComponents;
