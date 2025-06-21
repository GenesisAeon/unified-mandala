import { NucleonScannerGRPC } from './NucleonScannerGRPC';

test('emits phi profiles', () => {
  const grpc = new NucleonScannerGRPC();
  const data: any[] = [];
  grpc.on('data', d => data.push(d));
  grpc.sendPhi(0.42);
  expect(data[0].phi).toBeCloseTo(0.42);
});
