import React from 'react';

interface TodoButtonProps {
  onComplete?: (data: any) => void;
}

const TodoButton: React.FC<TodoButtonProps> = ({ onComplete }) => {
  const handleClick = async () => {
    try {
      const res = await fetch('/usecases/todo/parse');
      const data = await res.json();
      onComplete?.(data);
    } catch {
      onComplete?.(null);
    }
  };

  return (
    <button aria-label="Parse TODOs" onClick={handleClick}>
      Parse TODOs
    </button>
  );
};

export default TodoButton;
