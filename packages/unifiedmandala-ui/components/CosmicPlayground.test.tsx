import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CosmicPlayground from './CosmicPlayground';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div role="presentation">{children}</div>,
  sphereGeometry: 'sphereGeometry',
  mesh: 'mesh',
  meshStandardMaterial: 'meshStandardMaterial',
  ambientLight: 'ambientLight',
  pointLight: 'pointLight'
}));

jest.mock('tone', () => ({
  Oscillator: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    dispose: jest.fn(),
    toDestination: jest.fn().mockReturnThis()
  }))
}));

test('renders oscillator sphere', () => {
  const { getByRole } = render(<CosmicPlayground />);
  expect(getByRole('presentation')).toBeInTheDocument();
});
