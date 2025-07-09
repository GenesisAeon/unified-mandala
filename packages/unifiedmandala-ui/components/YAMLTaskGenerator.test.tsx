import { render, fireEvent } from '@testing-library/react';
import YAMLTaskGenerator from './YAMLTaskGenerator';

test('generates yaml', () => {
  const { getByText, container } = render(<YAMLTaskGenerator />);
  fireEvent.click(getByText('Add Task'));
  const pre = container.querySelector('pre');
  expect(pre?.textContent).toContain('plugin');
});
