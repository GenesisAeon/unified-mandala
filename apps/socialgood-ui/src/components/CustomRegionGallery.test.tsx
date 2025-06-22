import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomRegionGallery from './CustomRegionGallery';

test('renders regions', () => {
  render(<CustomRegionGallery regions={['X', 'Y']} />);
  expect(screen.getByLabelText('Region Gallery')).toHaveTextContent('X');
  expect(screen.getByLabelText('Region Gallery')).toHaveTextContent('Y');
});
