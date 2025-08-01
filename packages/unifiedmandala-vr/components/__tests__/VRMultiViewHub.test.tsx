import { render, screen } from '@testing-library/react';
import React from 'react';
import { VRMultiViewHub } from '../VRMultiViewHub';

describe('VRMultiViewHub', () => {
  it('renders view', () => {
    render(<VRMultiViewHub view="vr" />);
    expect(screen.getByText(/Current view: vr/)).toBeInTheDocument();
  });
});
