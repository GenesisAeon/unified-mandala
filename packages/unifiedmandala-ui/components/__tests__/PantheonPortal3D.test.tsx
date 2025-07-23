import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PantheonPortal3D from '../PantheonPortal3D';

test('renders portal container', () => {
  render(<PantheonPortal3D />);
  expect(screen.getByTestId('pantheon-portal-3d')).toBeInTheDocument();
});
