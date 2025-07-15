import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PyramidVRMeetingRoom from './PyramidVRMeetingRoom';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div role="presentation">{children}</div>,
  sphereGeometry: 'sphereGeometry',
  mesh: 'mesh',
  meshStandardMaterial: 'meshStandardMaterial',
  ambientLight: 'ambientLight',
}));

test('renders avatars', () => {
  const { getAllByLabelText } = render(<PyramidVRMeetingRoom />);
  expect(getAllByLabelText('avatar').length).toBeGreaterThan(0);
});
