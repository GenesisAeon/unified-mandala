import { render, screen } from '@testing-library/react';
import { PoetryErrorBoundary } from './PoetryErrorBoundary';
import React from 'react';

test('shows poem on error', () => {
  const Bomb = () => { throw new Error('boom'); };
  render(
    <PoetryErrorBoundary>
      <Bomb />
    </PoetryErrorBoundary>
  );
  expect(screen.getByText('ChronoPoem')).toBeInTheDocument();
});
