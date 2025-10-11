import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorEmergence from './ErrorEmergence';

test('renders error messages', () => {
  render(<ErrorEmergence errors={['fail']} />);
  expect(screen.getByRole('alert')).toHaveTextContent('fail');
});
