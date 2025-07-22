import React, { useState } from 'react';

interface OnboardingModalProps {
  open: boolean;
  steps: string[];
  onComplete: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ open, steps, onComplete }) => {
  const [index, setIndex] = useState(0);
  if (!open) return null;
  const next = () => {
    if (index < steps.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete();
    }
  };
  return (
    <div role="dialog" aria-modal="true" className="onboarding-modal">
      <p>{steps[index]}</p>
      <button onClick={next}>{index < steps.length - 1 ? 'Weiter' : 'Fertig'}</button>
    </div>
  );
};

export default OnboardingModal;
