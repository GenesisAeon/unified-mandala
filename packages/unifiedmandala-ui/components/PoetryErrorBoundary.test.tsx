import { render, screen } from '@testing-library/react';
import React from 'react';
import { PoetryErrorBoundary } from './PoetryErrorBoundary';
import { PoetryModeProvider, usePoetryMode } from '../contexts/PoetryModeContext';

const Bomb = () => { throw new Error('boom'); };

function EnablePoetry() {
  const { toggle } = usePoetryMode();
  React.useEffect(() => { toggle(); }, [toggle]);
  return null;
}

test('shows generic error when poetry mode off', () => {
  render(
    <PoetryModeProvider>
      <PoetryErrorBoundary>
        <Bomb />
      </PoetryErrorBoundary>
    </PoetryModeProvider>
  );
  expect(screen.getByText('Error')).toBeInTheDocument();
});

test('shows poem when poetry mode enabled', () => {
  render(
    <PoetryModeProvider>
      <EnablePoetry />
      <PoetryErrorBoundary>
        <Bomb />
      </PoetryErrorBoundary>
    </PoetryModeProvider>
  );
  expect(screen.getByText(/Im Kreis der Genesis/)).toBeInTheDocument();
});
