import { loadActivity } from './ActivityDataLoader';
import * as dispatch from '../cli-tools/dispatchCmd';

test('loads activity when dispatcher returns 200', async () => {
  jest.spyOn(dispatch, 'dispatchCmd').mockResolvedValue(200);
  const data = await loadActivity();
  expect(data[0].id).toBe('demo');
});
