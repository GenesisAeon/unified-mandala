import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RefusalNotice from './RefusalNotice';

test('displays refusal message', () => {
  render(<RefusalNotice message="Policy prohibits this action" />);
  expect(screen.getByText('Policy prohibits this action')).toBeInTheDocument();
});
