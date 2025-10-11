import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VRBegegnungsraum from './VRBegegnungsraum';

global.fetch = jest.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({ value: 7 }) }),
) as any;

describe('VRBegegnungsraum', () => {
  it('renders label and crep value', async () => {
    render(<VRBegegnungsraum />);
    expect(screen.getByText('VR Raum')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('crep-value')).toHaveTextContent('CREP: 7'));
  });
});
