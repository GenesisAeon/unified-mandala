import React from 'react';
import TodoButton from './TodoButton';

interface Props {
  onSigil?: (data: any) => void;
  onTodos?: (data: any) => void;
  onMatch?: (data: any) => void;
}

const UsecaseComponents: React.FC<Props> = ({ onSigil, onTodos, onMatch }) => {
  const handleSigil = async () => {
    try {
      const res = await fetch('/sigil/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: '' }),
      });
      const data = await res.json();
      onSigil?.(data);
    } catch {
      onSigil?.(null);
    }
  };

  const handleMatch = async () => {
    try {
      const res = await fetch('/socialgood/match');
      const data = await res.json();
      onMatch?.(data);
    } catch {
      onMatch?.(null);
    }
  };

  return (
    <div aria-label="Usecase Components">
      <button aria-label="Generate Sigil" onClick={handleSigil}>
        Generate Sigil
      </button>
      <TodoButton onComplete={onTodos} />
      <button aria-label="Match SocialGood" onClick={handleMatch}>
        Match SocialGood
      </button>
    </div>
  );
};

export default UsecaseComponents;
