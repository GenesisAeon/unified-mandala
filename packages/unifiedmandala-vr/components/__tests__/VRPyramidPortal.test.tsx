import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VRPyramidPortal from '../VRPyramidPortal';

test('renders portal', () => {
  render(<VRPyramidPortal />);
  expect(screen.getByText('VR Pyramid Portal')).toBeInTheDocument();
});
