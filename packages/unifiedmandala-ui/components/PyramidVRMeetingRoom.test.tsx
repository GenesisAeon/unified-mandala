import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PyramidVRMeetingRoom from './PyramidVRMeetingRoom';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div role="presentation">{children}</div>,
  sphereGeometry: 'sphereGeometry',
  mesh: 'mesh',
  meshStandardMaterial: 'meshStandardMaterial',
  ambientLight: 'ambientLight',
}));

test('renders avatars and handles selection', () => {
  const onSelect = jest.fn();
  const services = [
    { id: 'local', position: [0, 0, 0] as [number, number, number], color: 'red', onSelect },
    { id: 'external', position: [1, 0, 0] as [number, number, number], color: 'blue', onSelect },
  ];
  const { getAllByLabelText } = render(<PyramidVRMeetingRoom services={services} />);
  const avatars = getAllByLabelText('avatar');
  expect(avatars).toHaveLength(2);
  fireEvent.click(avatars[0]);
  expect(onSelect).toHaveBeenCalledWith('local');
});
