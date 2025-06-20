import { callRest } from './RestClient';
import http from 'http';

it('performs a GET request to a local server', async () => {
  const server = http.createServer((_, res) => {
    res.end('ok');
  });
  await new Promise<void>((resolve) => server.listen(0, () => resolve()));
  const { port } = server.address() as any;
  const data = await callRest(`http://localhost:${port}`);
  server.close();
  expect(data).toBe('ok');
});
