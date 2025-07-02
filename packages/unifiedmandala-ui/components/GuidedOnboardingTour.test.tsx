import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GuidedOnboardingTour, { TourStep } from './GuidedOnboardingTour';

test('navigates through tour steps', () => {
  const steps: TourStep[] = [
    { title: 'Step 1', content: 'Welcome' },
    { title: 'Step 2', content: 'Finish setup' }
  ];
  const onFinish = jest.fn();
  render(<GuidedOnboardingTour steps={steps} onFinish={onFinish} />);
  expect(screen.getByText('Welcome')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Next'));
  expect(screen.getByText('Finish setup')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Finish'));
  expect(onFinish).toHaveBeenCalled();
});
