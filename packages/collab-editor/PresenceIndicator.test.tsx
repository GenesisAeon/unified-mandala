import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PresenceIndicator, PresenceUser } from './PresenceIndicator';

test('shows active users', () => {
  const users: PresenceUser[] = [
    { id: '1', name: 'Alice', active: true },
    { id: '2', name: 'Bob', active: false },
  ];
  render(<PresenceIndicator users={users} />);
  expect(screen.getByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('Bob')).toBeInTheDocument();
  expect(screen.getAllByTestId('indicator')).toHaveLength(2);
});
