// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CREPOverlay, { DEFAULT_THRESHOLDS } from '../CREPOverlay/CREPOverlay';

describe('DEFAULT_THRESHOLDS', () => {
  it('hat C=0.5, R=0.6, E=0.7, P=0.8', () => {
    expect(DEFAULT_THRESHOLDS).toMatchObject({ C: 0.5, R: 0.6, E: 0.7, P: 0.8 });
  });
});

describe('CREPOverlay', () => {
  const values = { C: 0.82, R: 0.44, E: 0.91, P: 0.87, Gamma: 0.736 };

  it('rendert alle 4 Dimensionen', () => {
    render(<CREPOverlay values={values} />);
    expect(screen.getByLabelText(/Kohärenz/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Resonanz/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Emergenz/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Poetik/)).toBeInTheDocument();
  });

  it('zeigt Gamma-Wert an', () => {
    render(<CREPOverlay values={values} />);
    expect(screen.getAllByText(/Γ = 0.736/).length).toBeGreaterThan(0);
  });

  it('zeigt keinen Gamma-Wert wenn nicht angegeben', () => {
    const { container } = render(<CREPOverlay values={{ C: 0.5, R: 0.5, E: 0.5, P: 0.5 }} />);
    expect(container.textContent).not.toMatch(/Γ = /);
  });
});
