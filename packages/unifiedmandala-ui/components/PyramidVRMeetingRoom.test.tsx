import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PyramidVRMeetingRoom from './PyramidVRMeetingRoom';

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div role="presentation">{children}</div>,
  sphereGeometry: 'sphereGeometry',
  mesh: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  meshStandardMaterial: 'meshStandardMaterial',
  ambientLight: 'ambientLight',
}));

test('renders service avatars and handles interaction', () => {
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const { getByLabelText } = render(<PyramidVRMeetingRoom />);
  const localAvatar = getByLabelText('avatar-local');
  const externalAvatar = getByLabelText('avatar-external');
  expect(localAvatar).toBeInTheDocument();
  expect(externalAvatar).toBeInTheDocument();
  fireEvent.click(localAvatar);
  expect(logSpy).toHaveBeenCalledWith('local service selected');
  logSpy.mockRestore();
});
