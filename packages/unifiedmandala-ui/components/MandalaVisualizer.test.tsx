import { render, waitFor } from '@testing-library/react';
import MandalaVisualizer from './MandalaVisualizer';

(global as any).fetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve({ activeUsers: 5, tasksCompleted: 10, averageCREP: 0.5 }) })
) as any;

describe('MandalaVisualizer', () => {
  it('renders metrics from api', async () => {
    const { getByLabelText, getByText } = render(<MandalaVisualizer />);
    await waitFor(() => getByLabelText('Mandala Visualizer'));
    expect(getByText(/Active: 5/)).toBeInTheDocument();
  });
});
