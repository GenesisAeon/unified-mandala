import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelfAuditModul from './SelfAuditModul';

test('renders repo stats', () => {
  render(<SelfAuditModul />);
  expect(screen.getByText('Self Audit')).toBeInTheDocument();
});
