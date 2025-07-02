import React, { useState } from 'react';

export interface TourStep {
  title: string;
  content: string;
}

export interface GuidedOnboardingTourProps {
  steps: TourStep[];
  onFinish?: () => void;
}

const GuidedOnboardingTour: React.FC<GuidedOnboardingTourProps> = ({ steps, onFinish }) => {
  const [index, setIndex] = useState(0);
  const step = steps[index];

  const next = () => {
    if (index < steps.length - 1) {
      setIndex(i => i + 1);
    } else {
      onFinish && onFinish();
    }
  };

  const prev = () => {
    setIndex(i => Math.max(0, i - 1));
  };

  return (
    <div aria-label="onboarding-tour">
      <h4>{step.title}</h4>
      <p>{step.content}</p>
      <button onClick={prev} disabled={index === 0}>Back</button>
      <button onClick={next}>{index === steps.length - 1 ? 'Finish' : 'Next'}</button>
    </div>
  );
};

export default GuidedOnboardingTour;
