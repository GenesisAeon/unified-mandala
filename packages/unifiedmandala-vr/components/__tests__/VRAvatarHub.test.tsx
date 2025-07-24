import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VRAvatarHub from '../VRAvatarHub';

test('adds and removes avatars', () => {
  const { getByLabelText, queryByText } = render(<VRAvatarHub initial={[]} />);
  fireEvent.click(getByLabelText('join'));
  expect(getByLabelText('avatar-list')).toHaveTextContent('avatar');
  fireEvent.click(getByLabelText('leave'));
  expect(queryByText('avatar')).toBeNull();
});
