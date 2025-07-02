import https from 'https';
import { dispatchCmd } from './dispatchCmd';
import * as grpc from '@grpc/grpc-js';

jest.mock('https', () => ({
  request: jest.fn((_url: string, _opts: any, cb: any) => {
    cb({ statusCode: 200 });
    return { write: jest.fn(), end: jest.fn(), on: jest.fn() };
  }),
}));

jest.mock('@grpc/grpc-js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    makeUnaryRequest: (_p: string, _s: any, _d: any, _data: any, cb: any) => cb(null, { status: 200 }),
    close: jest.fn()
  })),
  credentials: { createInsecure: jest.fn() }
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

test('dispatchCmd sends task via gRPC when protocol set', async () => {
  const status = await dispatchCmd('demo', 'localhost:50051', 'grpc');
  expect(status).toBe(200);
  expect((grpc.Client as unknown as jest.Mock)).toHaveBeenCalledWith('localhost:50051', grpc.credentials.createInsecure());
});
