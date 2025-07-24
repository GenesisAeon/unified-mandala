import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VRAvatarHub from '../VRAvatarHub';

test('renders and adds avatar', () => {
  render(<VRAvatarHub initialAvatars={['a']} />);
  expect(screen.getByText('a')).toBeInTheDocument();
  fireEvent.click(screen.getByText('add'));
  expect(screen.getAllByRole('listitem').length).toBe(2);
});
