import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Resonanzfeld from './Resonanzfeld';

test('renders message', () => {
  render(<Resonanzfeld message="Hallo" />);
  expect(screen.getByLabelText('Resonanzfeld')).toHaveTextContent('Hallo');
});
