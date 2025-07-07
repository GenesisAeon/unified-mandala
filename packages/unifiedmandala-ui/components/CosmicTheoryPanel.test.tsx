import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CosmicTheoryPanel from './CosmicTheoryPanel';

test('renders formulas', () => {
  render(<CosmicTheoryPanel formulas={['E=mc^2']} />);
  expect(screen.getByText('E=mc^2')).toBeInTheDocument();
});
