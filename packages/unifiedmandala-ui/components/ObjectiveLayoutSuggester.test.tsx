import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ObjectiveLayoutSuggester from './ObjectiveLayoutSuggester';
import * as service from '../../../services/objective2ui';

jest.spyOn(service, 'objectiveToLayout').mockResolvedValue('layout: sample');

test('generates layout suggestion', async () => {
  render(<ObjectiveLayoutSuggester />);
  fireEvent.change(screen.getByLabelText('objective-input'), { target: { value: 'dashboard' } });
  fireEvent.click(screen.getByText('Generate Layout'));
  await waitFor(() => screen.getByLabelText('layout-output'));
  expect(service.objectiveToLayout).toHaveBeenCalledWith('dashboard');
  expect(screen.getByLabelText('layout-output').textContent).toBe('layout: sample');
});
