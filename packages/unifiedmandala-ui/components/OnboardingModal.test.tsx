import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingModal from './OnboardingModal';

test('selects services after steps and calls onComplete with ids', () => {
  const onComplete = jest.fn();
  const services = [{ id: 'local-chatbot', name: 'Local', type: 'local', default_enabled: true }];
  render(
    <OnboardingModal open={true} steps={['Step1']} services={services} onComplete={onComplete} />,
  );
  expect(screen.getByText('Step1')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Weiter' }));
  expect(screen.getByText('Dienste auswählen:')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Fertig' }));
  expect(onComplete).toHaveBeenCalledWith(['local-chatbot']);
});
