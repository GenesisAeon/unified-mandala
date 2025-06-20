import https from 'https';
import { dispatchCmd } from './dispatchCmd';

jest.mock('https', () => ({
  request: jest.fn((_url: string, _opts: any, cb: any) => {
    cb({ statusCode: 200 });
    return { write: jest.fn(), end: jest.fn(), on: jest.fn() };
  }),
}));

const mockRequest = https.request as jest.Mock;

test('dispatchCmd posts task to endpoint', async () => {
  await dispatchCmd('demo', 'https://api.test/dispatch');
  expect(mockRequest).toHaveBeenCalledWith(
    'https://api.test/dispatch',
    expect.objectContaining({ method: 'POST' }),
    expect.any(Function)
  );
});
