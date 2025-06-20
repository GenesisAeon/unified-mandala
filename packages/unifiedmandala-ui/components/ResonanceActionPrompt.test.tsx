import { render } from '@testing-library/react';
import { ResonanceActionPrompt } from './ResonanceActionPrompt';

test('shows suggestion when R low', () => {
  const { getByTestId } = render(
    <ResonanceActionPrompt crep={{C:0,R:10,E:0,P:0}} />
  );
  expect(getByTestId('resonance-action').textContent).toContain('Pause');
});
