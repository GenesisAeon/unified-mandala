import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VRMeetingHall3D from '../VRMeetingHall3D';

test('renders VR meeting hall', () => {
  render(<VRMeetingHall3D />);
  expect(screen.getByText('VR Meeting Hall 3D')).toBeInTheDocument();
});
