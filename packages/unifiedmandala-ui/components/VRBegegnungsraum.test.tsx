import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VRBegegnungsraum from './VRBegegnungsraum';

describe('VRBegegnungsraum', () => {
  it('renders label', () => {
    render(<VRBegegnungsraum />);
    expect(screen.getByText('VR Raum')).toBeInTheDocument();
  });
});
