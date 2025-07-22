import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingModal from './OnboardingModal';

test('walks through steps and calls onComplete', () => {
  const onComplete = jest.fn();
  render(<OnboardingModal open={true} steps={["Step1","Step2"]} onComplete={onComplete} />);
  expect(screen.getByText('Step1')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Step2')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button'));
  expect(onComplete).toHaveBeenCalled();
});
